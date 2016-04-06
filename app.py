"""script to run web server"""
from web import application, socketio_app


def main():
    """web server start"""
    socketio_app.run(application, debug=True)


if __name__ == "__main__":
    main()
