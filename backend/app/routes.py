from flask import Blueprint, request, jsonify
from .extensions import db, limiter
from .models import User, Habit, Log
from argon2 import PasswordHasher
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from sqlalchemy.exc import IntegrityError
from datetime import datetime
import pytz
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from .utils import calculate_longest

bp = Blueprint("main", __name__)
ph = PasswordHasher()

@bp.get('/')
def home():
    users = User.query.order_by(User.email.asc()).all()
    return users

@bp.post('/api/register')
def register():
    content = request.get_json(silent=True)
    email = content["email"]
    password_hash = content["password_hash"]

    if not email or not password_hash:
        return jsonify({"error": "Missing credentials"}), 400

    user = User.query.filter_by(email=email).first()

    if user:
        return jsonify({"error": "Duplicate mail"}), 409

    hashed_password = ph.hash(password_hash)

    u = User(email=email, password_hash=hashed_password)
    db.session.add(u)
    db.session.commit()

    return jsonify({"message": "User registered successfully!"}), 201

@bp.post('/api/login')
@limiter.limit("5 per minute")
def login():
    content = request.get_json(silent=True)
    email = content["email"]
    password_hash = content["password_hash"]

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"msg": "Bad email"}), 401

    try:
        ph.verify(user.password_hash, password_hash)
        access_token = create_access_token(identity=email)
        return jsonify(access_token=access_token), 200
    except:
        return jsonify({"error": "Invalid username or password"}), 401

@bp.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    print("current user: " + current_user)
    return jsonify(logged_in_as=current_user), 200


@bp.delete('/api/users/<int:user_id>')
@jwt_required()
def delete_user(user_id: int):
    current_user = get_jwt_identity()
    user = User.query.get_or_404(user_id)

    if current_user == user.email:
        db.session.delete(user)
        db.session.commit()
        return f"Deleted {user_id}", 204
    else:
        return jsonify({"error": "Unauthorized"}), 401

@bp.post('/api/habits')
@jwt_required()
def add_habit():
    content = request.get_json(silent=True)
    name = content["name"]

    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()
    if user is None:
        return jsonify({"error": "User not found"}), 404

    try:
        h = Habit(user_id=user.id, name=name)
        db.session.add(h)
        db.session.commit()
    except IntegrityError:
        return jsonify({"error": "Duplicate entry"}), 409

    return jsonify({"id": h.id, "habit_name": name, "user_id": user.id}), 201

@bp.get('/api/habits')
def get_habits():
    habits = Habit.query.order_by(Habit.name.asc()).all()
    if habits is None or len(habits) == 0:
        return jsonify({"error": "Not found"}), 404
    
    return [
        {
            "id": h.id,
            "name": h.name
        }
        for h in habits
    ]

@bp.delete('/api/habits/<int:habit_id>')
@jwt_required()
def delete_habit(habit_id: int):
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()

    habit = Habit.query.filter_by(id=habit_id).first()
    if habit is None:
        return jsonify({"error": "Habit not found"}), 404

    if habit.user_id != user.id:
        return jsonify({"error": "Forbidden"}), 403

    db.session.delete(habit)
    db.session.commit()

    return f"Deleted {habit_id}", 204

@bp.post('/api/habits/<int:habit_id>/logs')
@jwt_required()
def add_log(habit_id: int):
    content = request.get_json(silent=True)
    completed = content["completed"]

    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()

    habit = Habit.query.get(habit_id)
    if habit is None or habit.user_id != user.id:
        return jsonify({"error": "Not found"}), 404

    if content and "date" in content:
        try:
            log_date = datetime.strptime(content["date"], "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"error": "Invalid date format, use YYYY-MM-DD"}), 400
    else:
        log_date = datetime.now(tz=pytz.timezone('Europe/Bratislava')).date()

    try:
        l = Log(habit_id=habit.id, date=log_date, completed=completed)
        db.session.add(l)
        db.session.commit()
    except IntegrityError:
        return jsonify({"error": "Duplicate entry"}), 409

    return jsonify({"id": l.id, "habit_id": l.habit_id, "completed": l.completed}), 201

@bp.delete('/api/habits/<int:habit_id>/logs/<int:log_id>')
@jwt_required()
def delete_log(log_id: int, habit_id: int):
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()

    log = Log.query.filter_by(id=log_id).first()
    if log is None:
        return jsonify({"error": "Log not found"}), 404

    habit = Habit.query.filter_by(id=habit_id).first()
    if habit is None:
        return jsonify({"error": "Habit not found"}), 404

    if habit.user_id != user.id:
        return jsonify({"error": "Forbidden"}), 403

    db.session.delete(log)
    db.session.commit()

    return f"Deleted {log_id}", 204

@bp.get('/api/habits/<int:habit_id>/logs')
@jwt_required()
def get_logs(habit_id):
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()

    habit = Habit.query.get(habit_id)
    if habit is None or habit.user_id != user.id:
        return jsonify({"error": "Not found"}), 404
    

    from_date_str = request.args.get('from')
    to_date_str = request.args.get('to')

    query = Log.query.filter_by(habit_id=habit.id)

    if from_date_str:
        try:
            from_date = datetime.strptime(from_date_str, "%Y-%m-%d").date()
            query = query.filter(Log.date >= from_date)
        except ValueError:
            return jsonify({"error": "Invalid 'from' date format"}), 400

    if to_date_str:
        try:
            to_date = datetime.strptime(to_date_str, "%Y-%m-%d").date()
            query = query.filter(Log.date <= to_date)
        except ValueError:
            return jsonify({"error": "Invalid 'to' date format"}), 400

    logs = query.order_by(Log.date.asc()).all()
    return [
            {
                "id": l.id,
                "date": l.date,
                "completed": l.completed
            }
            for l in logs
        ], 200


@bp.get('/api/habits/<int:habit_id>/stats')
@jwt_required()
def get_longest(habit_id):
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()

    habit = Habit.query.get(habit_id)
    if habit is None or habit.user_id != user.id:
        return jsonify({"error": "Not found"}), 404

    query = Log.query.filter_by(habit_id=habit.id)
    logs = query.order_by(Log.date.asc()).all()
    longest = calculate_longest([
        {
            "id": l.id,
            "date": l.date,
            "completed": l.completed
        }
        for l in logs
    ])

    return longest, 200