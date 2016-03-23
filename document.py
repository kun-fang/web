import json
from flask import request

from web import application, session, utils, models, login_required

@application.route("/doc/")
@application.route("/doc/<name>")
def get_document(name=None):
    """document page"""
    doc = utils.get_document(name)


@application.route("/new_doc", methods=["POST"])
def create_document():
    """create a new document"""
    email = session.get('email')
    with models.managed_session() as sess:
        user = utils.get_user(email, sess=sess)
        document = utils.new_document(user, sess=sess).as_dict()
        document['history'] = []
        return utils.json_dumps(document)


@application.route("/user_data", methods=["GET"])
@login_required
def get_user():
    """get data regarding a user"""
    email = session['email']
    with models.managed_session() as sess:
        user = utils.get_user(email, sess=sess)
        documents = [x.as_dict() for x in user.owned_documents]
        user = user.as_dict()
        user['documents'] = documents
    return utils.json_dumps(user)