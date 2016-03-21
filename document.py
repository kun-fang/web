import json
from flask import request

from web import application, utils, models

@application.route("/doc/")
@application.route("/doc/<name>")
def get_document(name=None):
    """document page"""
    doc = utils.get_document(name)


@application.route("/new_doc", methods=["POST"])
def create_document():
    """create a new document"""
    email = json.loads(request.data)['email']
    with models.managed_session() as sess:
        user = utils.get_user(email, sess=sess)
        document = utils.new_document(user, sess=sess).as_dict()
        document['history'] = []
        return utils.json_dumps(document)
