"""web server script"""
from functools import wraps
import json
from flask import Flask, request, session, redirect, url_for, render_template

from web import models, utils

application = Flask(__name__)  # pylint: disable = invalid-name

from web import login, document



def login_required(func):
    @wraps(func)
    def decorated_funcs(*args, **kwargs):
        email = session.get('email');
        if email is None:
            return redirect(url_for('login', redirect_to=request.url))
        else:
            return func(*args, **kwargs)
    return decorated_funcs


@application.route("/")
@login_required
def index():
    """index page"""
    print request.method
    email = session.get('email')
    return render_template('main.html')


@application.route("/template/<file>")
@login_required
def get_template_file(file):
    """get a template file"""
    return render_template(file)