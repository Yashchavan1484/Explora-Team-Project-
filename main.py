from flask import Flask,render_template,redirect, url_for, flash, request,abort
from flask_sqlalchemy import SQLAlchemy

import json
from flask_login import UserMixin, login_user, LoginManager, current_user, logout_user,UserMixin
from sqlalchemy.orm import relationship, DeclarativeBase

from werkzeug.security import generate_password_hash, check_password_hash
from detection import  HumanCounter
import os
import smtplib
from forms import RegisterForm,LoginForm


## -------------------------------------------- Flask app configuration----------------------------------------
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get("flask_key")
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///tourist.db"
login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return db.get_or_404(User, user_id)

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)
db.init_app(app)



# ----------------------------------------Junction table for User-Destination many-to-many relationship
class User(UserMixin,db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)  # Remember to hash passwords
    destinations = db.relationship('Destination', back_populates='user', cascade='all, delete-orphan')

class Destination(db.Model):
    __tablename__ = 'destinations'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)  # e.g., "Summer Europe Trip"
    place = db.Column(db.String(100), nullable=False)  # e.g., "Paris, France"
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('User', back_populates='destinations')

    __table_args__ = (
        db.UniqueConstraint('user_id', 'name', 'place', name='_user_destination_uc'),
    )

with app.app_context():
    db.create_all()
###----------------------------------------------------Human detection --------------------------
detection_model = HumanCounter()



## --------------------------------------------------------Data segments---------------------------------
with open("data/tourist_places.json","r") as file:
    data = json.load(file)
pune_data = data["Pune"]
mumbai_data = data["Mumbai"]
pune_places = list(pune_data.keys())
mumbai_places = list(mumbai_data.keys())

##  ---------------------------------------Mail automation -----------------------------------------
def send_mail(name, email, phone, message):
    with smtplib.SMTP("smtp.gmail.com",587) as connection:
        email_message = f"Subject:Contact Us Request\n\nName:{name}\nEmail:{email}\nPhone:{phone}\nMessage:{message}\n Thank you for contacting us!"
        connection.starttls()
        connection.login(os.environ.get("email"), os.environ.get("password"))
        if connection.sendmail(os.environ.get("email"), email, email_message):
            print("Successfull")
        else:
            print("not")




# ------------------------------------------Backend--------------------------------------------------

@app.route("/")
def home():
    """Render the homepage with tourist place data for Pune and Mumbai."""
    return render_template("homepage/homepage.html",
                           pune=pune_data,
                           mumbai=mumbai_data,
                           pune_list=pune_places,
                           mumbai_list=mumbai_places,
                           user=current_user)


@app.route("/explore")
def explore():
    """Render the explore destinations page with city data."""
    return render_template("explore-destinations/explore-destinations.html",pune=pune_data,
                           mumbai=mumbai_data,
                           pune_list=pune_places,
                           mumbai_list=mumbai_places,
                           user=current_user)


@app.route("/cost_estimation")
def cost_estimation():
    """Render the travel cost estimation page."""
    return render_template("cost-estimate/cost-estimate.html",user=current_user)


@app.route("/plan_trip")
def plan_trip():
    """Render the trip planning page for users."""
    return render_template("plan-your-trip/plan-your-trip.html",user=current_user)


@app.route("/destination/<string:place>/<string:name>")
def destination_detail(place,name):
    """Display details for a specific tourist destination."""
    if place =="Pune":
        place_detail = pune_data[name]
    elif place == "Mumbai":
        place_detail = mumbai_data[name]
    elif place=="all":
        place_detail = data

    return render_template("destination-details/details.html",detail=place_detail,name = name,user=current_user,place=place)


@app.route("/login",methods=["GET","POST"])
def login():
    """Handle user login authentication and session setup."""
    form = LoginForm()
    if form.validate_on_submit():
        user_email = form.email.data
        user_data = db.session.execute(db.select(User).where(User.email == user_email)).scalar()
        if not user_data:
            flash("User with entered email is not registered. Please register!")
            return redirect(url_for("login"))
        elif not check_password_hash(user_data.password,form.password.data):
            flash("Password entered is wrong")
            return redirect(url_for("login"))
        else:
            login_user(user_data)
            return redirect(url_for("home"))
    return render_template("user_login_page/login.html",form=form)


@app.route("/register",methods=["GET","POST"])
def register():
    """Register a new user and create an account if validation passes."""
    form = RegisterForm()
    if form.validate_on_submit():
        existing_user = User.query.filter_by(email=form.email.data).first()

        if existing_user:
            flash("You've already signed up with this email. Please log in instead!")
            return redirect(url_for("login"))
        hashed_passoword =generate_password_hash(form.password.data,method="pbkdf2:sha256", salt_length=8)
        new_user = User(
            name = form.name.data,
            email = form.email.data,
            password = hashed_passoword
        )
        try:
            db.session.add(new_user)
            db.session.commit()  # Commit before logging in
            login_user(new_user)
            return redirect(url_for("home"))
        except Exception as e:
            db.session.rollback()
            flash("An error occurred during registration. Please try again.")

        return redirect(url_for("home"))

    return render_template("user_login_page/register.html",form=form,current_user=current_user)


@app.route("/logout")
def logout():
    """Log out the current user and redirect to home."""
    logout_user()
    return redirect(url_for("home"))


@app.route("/add/<string:place>/<string:name>")
def add_place(place,name):
    """Add a destination to the current user's saved list."""
    if not current_user.is_authenticated:
        flash("You are not logged in!")
        return redirect(url_for("login"))
    existing = Destination.query.filter_by(
        user_id=current_user.id,
        name=name,
        place=place
    ).first()

    if existing:
        flash("This destination is already in your list!")
        return redirect(url_for('destination_detail', place=place, name=name))

    try:
        destination = Destination(
            place=place,
            name=name,
            user_id=current_user.id
        )
        db.session.add(destination)
        db.session.commit()
        flash("Destination added successfully!")
    except IntegrityError:
        db.session.rollback()
        flash("This destination is already in your list!")

    return redirect(url_for('destination_detail', place=place, name=name))


@app.route("/dashboard")
def dashboard():
    """Render the user dashboard with their saved destinations and crowd detection."""
    destinations = db.session.execute(db.select(Destination).where(Destination.user_id == current_user.id)).scalars().all()
    return render_template("dashboard/dashboard.html",user=current_user,destination=destinations,data=data,model=detection_model)


@app.route("/contact", methods=["POST", "GET"])
def contact():
    """Handle contact form submission and send confirmation email."""
    if request.method == "POST":
        data = request.form
        print(data)
        send_mail(data["name"], data["email"], data["phone"], data["message"])
        return render_template("contact/contact.html", current_user=current_user, msg_sent=True)
    return render_template("contact/contact.html", current_user=current_user, msg_snet=False)


@app.route("/delete/<int:dest_id>")
def delete(dest_id):
    """Delete a destination from the user's saved list."""
    destination = db.get_or_404(Destination, dest_id)
    db.session.delete(destination)
    db.session.commit()
    return redirect(url_for("dashboard"))



if __name__ == "__main__":
    app.run(debug=True)
