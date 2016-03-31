# pylint: disable = no-member, invalid-name
"""sqlalchemy database model for web database"""
from contextlib import contextmanager
import datetime
import json
import os
import random
import string
import sqlalchemy
from sqlalchemy import Column, Integer, Text, String, DateTime, BLOB, MetaData, ForeignKey, Index
from sqlalchemy.ext.declarative import as_declarative
from sqlalchemy.orm import sessionmaker, backref, relationship

NAME_LENGTH = 16

CURRENT_PATH = os.getcwd()
engine = sqlalchemy.create_engine('sqlite:///{}/web/web.db'.format(CURRENT_PATH))


def random_string(length):
    """generate a random string"""
    char_choices = string.ascii_uppercase + string.ascii_lowercase + string.digits
    return "".join(random.choice(char_choices) for _ in xrange(length))


@contextmanager
def managed_session(sess=None):
    """create sqlalchemy session"""
    if sess is not None:
        yield sess
        return
    try:
        sess = sess or sessionmaker(bind=engine)()
        yield sess
    finally:
        sess.close()


@as_declarative(metadata=MetaData())
class Base(object):
    """Base class for database models"""
    @classmethod
    def keys(cls):
        """return all the mapped keys for the model"""
        return [cls.__mapper__.get_property_by_column(c).key for c in cls.__table__.columns]

    def as_dict(self):
        """convert sqlalchemy object to a dict"""
        return {key: getattr(self, key) for key in self.keys()}


class User(Base):
    """User table"""
    __tablename__ = "user"

    user_id = Column("id", Integer, primary_key=True)
    email = Column("email", String(256), unique=True, nullable=False)

    Index('user_email_idx', 'email', unique=True)

    def __init__(self, email):
        self.email = email

    def as_dict(self):
        result = super(User, self).as_dict()
        result['documents'] = [x.as_dict() for x in self.owned_documents]
        return result


class Document(Base):
    """Document table"""
    __tablename__ = "document"

    document_id = Column("id", Integer, primary_key=True)
    user_id = Column("user_id", Integer, ForeignKey("user.id"), nullable=False)
    text = Column("text", BLOB, default="")
    last_save_time = Column("last_save_time", DateTime)
    name = Column("name", String(64), unique=True)

    user = relationship(User, backref=backref("owned_documents", cascade="delete, delete-orphan"))

    Index('document_name_idx', 'name', unique=True)

    def __init__(self, user):
        self.user = user
        self.text = ""
        self.last_save_time = datetime.datetime.now()
        self.name = random_string(NAME_LENGTH)

    def as_dict(self):
        result = super(Document, self).as_dict()
        result['history'] = [x.as_dict() for x in self.history]
        return result


class EditHistory(Base):
    """Edit History"""
    __tablename__ = "edithistory"

    document_id = Column(
        "doc_id", Integer, ForeignKey("document.id"), nullable=False, primary_key=True
    )
    user_id = Column("user_id", Integer, ForeignKey("user.id"), nullable=False, primary_key=True)
    ts = Column("ts", DateTime, primary_key=True)
    diff = Column("diff", Text)

    user = relationship(User, cascade="delete")
    document = relationship(Document, backref=backref("history", cascade="delete, delete-orphan"))

    def __init__(self, document, diff):
        self.document = document
        self.user = document.user
        self.ts = datetime.datetime.now()
        self.diff = json.dumps(diff)

    def as_dict(self):
        result = super(EditHistory, self).as_dict()
        result['diff'] = json.loads(result['diff'])
        return result


def init_models():
    """create the tables"""
    Base.metadata.create_all(engine)
