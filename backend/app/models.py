from .extensions import db
from datetime import datetime
import pytz

class User(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=lambda:datetime.now(tz=pytz.timezone('Europe/Bratislava')))
    habits = db.relationship('Habit', backref='user', cascade='all, delete-orphan')

    def __repr__(self) -> str:
        return f"<User {self.id} {self.email} {self.created_at}>"

class Habit(db.Model):
    __tablename__ = "habit"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=lambda:datetime.now(tz=pytz.timezone('Europe/Bratislava')))
    logs = db.relationship('Log', backref='habit', cascade='all, delete-orphan')

    __table_args__ = (
        db.UniqueConstraint('user_id', 'name', name='uq_user_habit_name'),
    )

    def __repr__(self) -> str:
        return f"<Habit {self.id} {self.user_id} {self.name} {self.created_at}>"

class Log(db.Model):
    __tablename__ = "log"

    id = db.Column(db.Integer, primary_key=True)
    habit_id = db.Column(db.Integer, db.ForeignKey('habit.id'))
    completed = db.Column(db.Boolean, default=False)
    date = db.Column(db.Date, default=lambda: datetime.now(tz=pytz.timezone('Europe/Bratislava')).date())

    __table_args__ = (
        db.UniqueConstraint('habit_id', 'date', name='uq_habit_date'),
    )