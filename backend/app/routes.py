from flask import Blueprint, request, jsonify
from .extensions import db
from .models import User, Habit, Log
from argon2 import PasswordHasher
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

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
def login():
    content = request.get_json(silent=True)
    email = content["email"]
    password_hash = content["password_hash"]

    user = User.query.filter_by(email=email).first()

    if email != user.email:
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
def delete_user(user_id: int):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()

    return f"Deleted {user_id}", 204

@bp.post('/api/habits')
@jwt_required()
def add_habit():
    content = request.get_json(silent=True)
    name = content["name"]

    current_user = get_jwt_identity()
    try:
        user = User.query.filter_by(email=current_user).first()
    except:
        return jsonify({"error": "Invalid username or password"}), 401

    print(user.id, name)

    h = Habit(user_id=user.id, name=name)
    db.session.add(h)
    db.session.commit()

    return f"Added {user.id, name}", 201

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

@bp.post('/api/logs')
@jwt_required()
def add_log():
    content = request.get_json(silent=True)
    habit_id = content["habit_id"]
    completed = content["completed"]

    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()

    habit = Habit.query.get(habit_id)
    if habit is None or habit.user_id != user.id:
        return jsonify({"error": "Not found"}), 404

    print(habit_id, completed)

    l = Log(habit_id=habit_id, completed=completed)
    db.session.add(l)
    db.session.commit()

    return f"Added {habit_id, completed}", 201

@bp.delete('/api/logs/<int:log_id>')
@jwt_required()
def delete_log(log_id: int):
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()

    log = Log.query.filter_by(id=log_id).first()
    if log is None:
        return jsonify({"error": "Log not found"}), 404

    habit = Habit.query.filter_by(id=log.habit_id).first()
    if habit is None:
        return jsonify({"error": "Habit not found"}), 404

    if habit.user_id != user.id:
        return jsonify({"error": "Forbidden"}), 403

    db.session.delete(log)
    db.session.commit()

    return f"Deleted {log_id}", 204