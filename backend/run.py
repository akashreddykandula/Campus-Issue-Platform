"""
run.py
------
Application entry point.
  - Development : python run.py
  - Production  : gunicorn run:app --config gunicorn.conf.py
"""

import os
from app import create_app

app = create_app(os.environ.get("FLASK_ENV", "development"))
print("FLASK_ENV =", os.environ.get("FLASK_ENV"))

print("SESSION_COOKIE_SAMESITE =", app.config["SESSION_COOKIE_SAMESITE"])

print("SESSION_COOKIE_SECURE =", app.config["SESSION_COOKIE_SECURE"])

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=True)
