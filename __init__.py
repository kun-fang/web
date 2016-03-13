"""web server script"""
import json
from flask import Flask, session, redirect, url_for, render_template

from web import models, utils

application = Flask(__name__)  # pylint: disable = invalid-name

from web import login


@application.route("/")
def index():
    """index page"""
    email = session.get('email')
    if not email:
        return redirect(url_for('login'))
    with models.managed_session() as sess:
        user = utils.get_user(email, sess=sess)
        docs = [x.as_dict() for x in user.owned_documents] if user else []
    return render_template('doc_list.html', docs=utils.json_dumps(docs), email=email)
