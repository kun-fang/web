"""login page"""
import json
from flask import request, render_template, session, redirect, url_for

from web import application, utils, models


@application.route("/login", methods=["GET"])
def login_page():
    """login page"""
    redirect_to = request.args.get('redirect_to', '/')
    return render_template("login.html", redirect_to=redirect_to)


@application.route("/login", methods=["POST"])
def login():
    """login requests"""
    data = json.loads(request.data)
    name = data['name']
    email = data['email']
    redirect_to = request.args['redirect_to']
    with models.managed_session() as sess:
        user = utils.get_user(name, email, sess=sess)
        session['name'] = user.name
        session['email'] = user.email
    return redirect(redirect_to)


@application.route('/logout', methods=["GET", "POST"])
def logout():
    """remove the email from session"""
    session.pop('name', None)
    session.pop('email', None)
    return redirect(url_for('login_page'))


# set the secret key.  keep this really secret:
application.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'
