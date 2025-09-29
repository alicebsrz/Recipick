# backend/models.py
import uuid
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.types import TypeDecorator, CHAR
from sqlalchemy.dialects.postgresql import UUID as PostgresUUID
from .database import Base

# Tipo UUID compatível com SQLite e PostgreSQL
class GUID(TypeDecorator):
    impl = CHAR
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == 'postgresql':
            return dialect.type_descriptor(PostgresUUID())
        else:
            return dialect.type_descriptor(CHAR(36))

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        elif dialect.name == 'postgresql':
            return str(value)
        else:
            if not isinstance(value, uuid.UUID):
                return str(uuid.UUID(value))
            else:
                return str(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        else:
            if not isinstance(value, uuid.UUID):
                return uuid.UUID(value)
            return value

class User(Base):
    __tablename__ = "users"
    # Usando ID inteiro para simplicidade
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    favorite_recipes = relationship("FavoriteRecipe", back_populates="owner")

class FavoriteRecipe(Base):
    __tablename__ = "favorite_recipes"
    id = Column(Integer, primary_key=True, index=True)
    recipe_id = Column(Integer, index=True)
    recipe_title = Column(String)
    recipe_image_url = Column(String)
    # Usando ID inteiro para simplicidade
    user_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="favorite_recipes")