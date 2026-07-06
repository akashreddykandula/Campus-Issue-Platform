"""
extensions.py
-------------
Instantiate Flask extensions here (without binding to an app).
The app factory in __init__.py calls init_app() on each one.
This pattern avoids circular imports.
"""

from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFProtect
from flask_cors import CORS

db = SQLAlchemy()
login_manager = LoginManager()
migrate = Migrate()
csrf = CSRFProtect()
cors = CORS()
