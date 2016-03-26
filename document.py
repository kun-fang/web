import json
from flask import request, jsonify
from sqlalchemy.orm.exc import NoResultFound

from web import application, session, utils, models, login_required, InvalidRequest

@application.route("/doc/<name>")
@login_required
def get_document(name):
    """document page"""
    email = session['email']
    with models.managed_session() as sess:
        doc = utils.get_document(name, sess=sess)
        if not doc or doc.user.email != email:
            raise InvalidRequest(401, "Not authorized")
        else:
            return jsonify(doc.as_dict())



@application.route("/new_doc", methods=["POST"])
@login_required
def create_document():
    """create a new document"""
    email = session['email']
    with models.managed_session() as sess:
        user = utils.get_user(email, sess=sess)
        document = utils.new_document(user, sess=sess).as_dict()
        return jsonify(document)


@application.route("/del_doc", methods=["POST"])
@login_required
def del_document():
    """delete document"""
    email = session['email']
    doc = json.loads(request.data)['doc']
    with models.managed_session() as sess:
        try:
            doc = sess.query(models.Document).filter_by(document_id=doc['document_id']).one()
        except NoResultFound:
            doc = None
        if not doc or doc.user.email != email:
            raise InvalidRequest(401, "Not authorized")
        else:
            sess.delete(doc)
            sess.commit()
            return "success"


@application.route("/user_data", methods=["GET"])
@login_required
def get_user():
    """get data regarding a user"""
    email = session['email']
    with models.managed_session() as sess:
        user = utils.get_user(email, sess=sess)
        return jsonify(user.as_dict())


@application.route("/save_doc/<name>", methods=['POST'])
@login_required
def save_document(name):
    """save document and document history"""
    email = session['email']
    text = json.loads(request.data)['text']
    with models.managed_session() as sess:
        doc = utils.get_document(name, sess=sess)
        if not doc and doc.user.email != email:
            raise InvalidRequest(401, "Not authorized")
        else:
            old_text = doc.text
            doc.text = text
            with sess.no_autoflush:
                diff = utils.diff_text(old_text, text)
                sess.add(models.EditHistory(doc, diff))
                doc = sess.merge(doc, load=True)
                sess.commit()
                return jsonify(doc.as_dict())


@application.route("/get_history", methods=['POST'])
@login_required
def get_history_document():
    """get the document text at a time ts"""
    email = session['email']
    data = json.loads(request.data)
    document = data['document']
    ts = data['ts']
    if not document and data['email'] != email:
        raise InvalidRequest(401, "Not authorized")
    else:
        text = document['text']
        for item in reversed(document['history']):
            if item['ts'] == ts:
                document['text'] = text
                return jsonify(document)
            text = utils.convert(text, item['diff'], back=True)
        return jsonify(document)
