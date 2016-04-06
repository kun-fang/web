from flask import render_template
from flask_socketio import emit

from web import application, socketio_app


@application.route("/websocket_test")
def test_page():
    return render_template("test.html")


@socketio_app.on('connect', namespace="/test_text")
def test_text_connect():
    emit('connect', {'status': 'success'})


@socketio_app.on('disconnect', namespace="/test_text")
def test_text_disconnect():
    emit('disconnect', {'status': 'success'})


@socketio_app.on('update_text', namespace="/test_text")
def test_text_update(data):
    emit('update_text', {'text': data['text']})
