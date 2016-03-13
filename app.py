"""script to run web server"""
from web import application


def main():
    """web server start"""
    application.run(debug=True)


if __name__ == "__main__":
    main()
