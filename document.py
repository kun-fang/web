from web import application, utils

@application.route("/doc/")
@application.route("/doc/<name>")
def get_document(name=None):
    """document page"""
    doc = utils.get_document(name)
