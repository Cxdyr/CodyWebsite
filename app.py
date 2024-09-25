from flask import Flask, render_template, redirect, url_for, request, session, flash
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
import os, json, random # type: ignore
from dotenv import load_dotenv

load_dotenv('key.env')

app = Flask(__name__)

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'default_secret_key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI', 'sqlite:///users.db')

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), nullable=False, unique=True)
    password = db.Column(db.String(150), nullable=False)
    coins = db.Column(db.Integer, default=1000)
    usertype = db.Column(db.Integer, default=1)  # 1 for regular users, 2 for developer/admin

with app.app_context():
    db.create_all()

with open('projects.json') as f:
    projects = json.load(f)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/projects')
def projects_page():
    return render_template('projects.html', projects=projects)

@app.route('/project/<int:project_id>')
def project(project_id):
    project = next((p for p in projects if p['id'] == str(project_id)), None)
    if project:
        return render_template('project.html', project=project)
    else:
        return "Project not found", 404
    
@app.route('/aboutme')
def aboutme():
    return render_template('aboutme.html')
    
@app.route('/skills')
def skills():
    return render_template('skills.html')

@app.route('/resume')
def resume():
    return render_template('resume.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        if len(password) < 5:
            error_message= "Password must be at least 5 characters long."
            return render_template('register.html', error_message=error_message)


        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return "Username already exists. Please choose a different one.", 400

        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        usertype = 2 if username == 'admin' else 1  # Assign 2 to developer, 1 to others

        user = User(username=username, password=hashed_password, usertype=usertype)
        db.session.add(user)
        db.session.commit()

        return redirect(url_for('login'))
    
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    error_message = None
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()
        if user and bcrypt.check_password_hash(user.password, password):
            session['user_id'] = user.id
            session['username'] = user.username
            session['usertype'] = user.usertype
            if user.usertype == 2:  # Redirect admin to the dashboard
                return redirect(url_for('dashboard'))
            return redirect(url_for('casino'))
        else:
            error_message = "Invalid username or password. Please try again."

    return render_template('login.html', error_message=error_message)

@app.route('/casino')
def casino():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    user = User.query.get(session['user_id'])

    # Fetch top 5 users with the most coins
    leaderboard = User.query.order_by(User.coins.desc()).limit(5).all()

    if request.args.get('add_coins') == 'true':
        if not session.get('coins_added', False):
            user.coins += 1000
            session['coins_added'] = True  # Prevent adding coins again
            db.session.commit()
            flash("Thank you for supporting me on GitHub! You've been awarded 1000 coins.")
        else:
            flash("You have already claimed your coins for following on GitHub.")

    return render_template('casino.html', user=user, leaderboard=leaderboard)


@app.route('/logout')
def logout():
    session.pop('user_id', None)
    session.pop('username', None)
    session.pop('usertype', None)
    return redirect(url_for('login'))


@app.route('/dashboard', methods=['GET', 'POST'])
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    user = User.query.get(session['user_id'])
    if user.usertype != 2:
        return "Access denied", 403

    if request.method == 'POST':
        action = request.form.get('action')
        username = request.form.get('username')

        if action == 'reset_coins':
            user_to_reset = User.query.filter_by(username=username).first()
            if user_to_reset:
                user_to_reset.coins = 0
                db.session.commit()
                flash(f"{username}'s coins have been reset to 0.")
            else:
                flash(f"User {username} not found.")
        elif action == 'remove_user':
            user_to_remove = User.query.filter_by(username=username).first()
            if user_to_remove:
                db.session.delete(user_to_remove)
                db.session.commit()
                flash(f"User {username} has been removed from the database.")
            else:
                flash(f"User {username} not found.")

    users = User.query.all()
    return render_template('dashboard.html', users=users)

@app.route('/dice', methods=['GET', 'POST'])
def dice():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    user = User.query.get(session['user_id'])
    dice_image = f"images/dice/dice.png"

    if request.method == 'POST':
        bet_type = request.form['bet_type']
        bet_amount = int(request.form['bet_amount'])
        if bet_amount > user.coins:
            flash('You do not have enough coins for this bet.')
            return redirect(url_for('dice'))

        dice_roll = random.randint(1, 6)
        dice_image = f"images/dice/dice{dice_roll}.png"
        result = ""

        if bet_type == 'even' and dice_roll % 2 == 0:
            user.coins += bet_amount  # Double the bet
            result = f"Dice rolled {dice_roll}. You won {bet_amount} coins!"
        elif bet_type == 'odd' and dice_roll % 2 != 0:
            user.coins += bet_amount  # Double the bet
            result = f"Dice rolled {dice_roll}. You won {bet_amount} coins!"
        elif bet_type.isdigit() and int(bet_type) == dice_roll:
            user.coins += bet_amount * 10  # 10x the bet
            result = f"Dice rolled {dice_roll}. You won {bet_amount * 10} coins!"
        else:
            user.coins -= bet_amount  # Lose the bet
            result = f"Dice rolled {dice_roll}. You lost {bet_amount} coins."

        db.session.commit()
        flash(result)

    return render_template('dice.html', user=user, dice_image=dice_image)


    
@app.route('/blackjack')
def blackjack():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    user = User.query.get(session['user_id'])
    return render_template('blackjack.html', user=user)


if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
