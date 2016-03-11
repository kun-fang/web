"""web util functions"""
import difflib
from sqlalchemy.orm.exc import NoResultFound

from web import models


class InvalidEntity(Exception):
    """Exception for invalid input"""
    pass


def get_entity(model, id_, sess=None):
    """get entity by id"""
    with models.managed_session(sess=sess) as sess:
        return sess.query(model).filter_by(id=id_).all()


def new_document(user, sess=None):
    """create a new document"""
    with models.managed_session(sess=sess) as sess:
        doc = models.Document(user)
        sess.add(doc)
        sess.commit()


def update_document(doc_id, name, text, sess=None):
    """update a document"""
    with models.managed_session(sess=sess) as sess:
        doc = get_entity(models.Document, doc_id)
        doc.text = text
        doc.name = name
        sess.merge(doc, load=True)
        sess.commit()


def get_document(name, sess=None):
    """get document by random name"""
    with models.managed_session(sess=sess) as sess:
        try:
            doc = sess.query(models.Document).filter_by(name=name).one()
            return doc
        except NoResultFound:
            return None


def new_user(email, sess=None):
    """create a new user"""
    with models.managed_session(sess=sess) as sess:
        user = models.User(email)
        sess.add(user)
        sess.commit()


def get_user(email, sess=None):
    """get user by email"""
    with models.managed_session(sess=sess) as sess:
        try:
            user = sess.query(models.User).filter_by(email=email).one()
            return user
        except NoResultFound:
            return None


def new_edit(user, document, old_text, new_text, sess=None):
    """create a new text"""
    with models.managed_session(sess=sess) as sess:
        diff = diff_text(old_text, new_text)
        edit = models.EditHistory(user, document, diff)
        sess.add(edit)
        sess.commit()


def get_history(user_id, document_id, sess=None):
    """get edit history of a document"""
    with models.managed_session(sess=sess) as sess:
        document = get_entity(models.Document, document_id)
        if document.user_id != user_id:
            raise InvalidEntity("document and user do not match")
        return document.history


def diff_text(old_text, new_text):
    """compare two texts return diff in dictionary"""
    new_text = new_text.split("\n")
    old_text = old_text.split("\n")
    matcher = difflib.SequenceMatcher(a=old_text, b=new_text)
    diff = []
    for tag, i1, i2, j1, j2 in matcher.get_opcodes():  # pylint: disable = invalid-name
        if tag == 'equal':
            continue
        diff.append({
            'old': [i1, i2, old_text[i1:i2]],
            'new': [j1, j2, new_text[i1:i2]]
        })
    return diff


def revert_diff(item):
    """revert diff direction"""
    return {
        'old': item['new'],
        'new': item['old']
    }


def convert(text, diff, back=False):
    """convert the text according to diff"""
    text = text.split("\n")
    new_text = []
    prev = 0
    for item in diff:
        if back:
            item = revert_diff(item)
        start, end, content = item['old']
        if text[start:end] != content:
            print text[start:end]
            print content
            raise ValueError("diff doesn't match")
        new_text.extend(text[prev:start])
        new_text.extend(item['new'][2])
        prev = end
    new_text.extend(text[prev:])
    return "\n".join(new_text)
