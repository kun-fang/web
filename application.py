"""web server script"""
from flask import Flask

application = Flask(__name__)  # pylint: disable=invalid-name


@application.route("/")
def hello():
    return "Hello World!"


def main():
    """web server start"""
    application.run(debug=True)


if __name__ == "__main__":
    main()
