"""login page"""
import json
from flask import request, render_template, session, redirect, url_for

from web import application


@application.route("/login", methods=["POST", "GET"])
def login():
    """login requests"""
    if request.method == "GET":
        return render_template('login.html')
    elif request.method == "POST":
        session['email'] = json.loads(request.data)['email']
        return json.dumps({'email': session['email']})


@application.route('/logout')
def logout():
    """remove the email from session"""
    session.pop('email', None)
    return redirect(url_for('login'))


# set the secret key.  keep this really secret:
application.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'
