from flask import render_template, session, redirect
from flask_socketio import emit, join_room, leave_room

from web import application, login_required, socketio_app, utils, models


DOC_LENGTH = 16


@application.route("/interactive", methods=["GET"])
@login_required
def interactive_noname():
    doc = models.random_string(DOC_LENGTH)
    return redirect("/interactive/{}".format(doc))


@application.route("/interactive/<doc>", methods=["GET"])
@login_required
def interative_page(doc):
    email = session.get('email')
    name = session.get('name')
    return render_template("interactive.html", name=name, email=email, doc=doc)


@socketio_app.on('connect', namespace="/doc_edit")
@login_required
def test_text_connect():
    emit('connect', {'status': 'success'}, namespace='/doc_edit')


@socketio_app.on('disconnect', namespace="/doc_edit")
@login_required
def test_text_disconnect():
    emit('disconnect', {'status': 'success'}, namespace='/doc_edit')


@socketio_app.on('update_text', namespace="/doc_edit")
@login_required
def text_update(data):
    room = data['room']
    version = data['version']
    text = data.get('text', '')
    email = session.get('email')
    print room, version, text, email
    with models.managed_session() as sess:
        room_obj = utils.get_room(room, sess=sess, create_room=True)
        if room_obj.text != text and room_obj.version < version:
            room_obj.text = text
            room_obj.version = version
            room_obj = sess.merge(room_obj, load=True)
            sess.commit()
        room_obj = room_obj.as_dict()
    room_obj['from'] = email
    emit('update_text', room_obj, namespace='/doc_edit', room=room)


@socketio_app.on('join', namespace="/doc_edit")
@login_required
def join_doc_room(data):
    room = data['room']
    user = {
        'name': session.get('name'),
        'email': session.get('email')
    }
    join_room(room)
    with models.managed_session() as sess:
        room_obj = utils.add_to_room(room, user, sess=sess).as_dict()
    emit('join', room_obj, namespace='/doc_edit', room=room)


@socketio_app.on('leave', namespace="/doc_edit")
@login_required
def leave_doc_room(data):
    room = data['room']
    user = {
        'name': session.get('name'),
        'email': session.get('email')
    }
    leave_room(room)
    with models.managed_session() as sess:
        room_obj = utils.remove_from_room(room, user, sess=sess).as_dict()
    emit('leave', room_obj, namespace='/doc_edit', room=room)
