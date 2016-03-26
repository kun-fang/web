"""web server script"""
from functools import wraps
from flask import Flask, request, session, redirect, url_for, render_template, jsonify

from web import models, utils

application = Flask(__name__)  # pylint: disable = invalid-name


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
    email = session.get('email')
    return render_template('main.html', email=email)


@application.route("/template/<file>")
@login_required
def get_template_file(file):
    """get a template file"""
    return render_template(file)


class InvalidRequest(Exception):
    """request errors"""
    def __init__(self, status_code, message):
        super(InvalidRequest, self).__init__()
        self.message = message
        self.status_code = status_code


@application.errorhandler(InvalidRequest)
def handle_invalid_request(error):
    response =  jsonify(error.message)
    response.error_code = error.error_code
    return response


from web import login, document