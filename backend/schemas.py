# backend/schemas.py
from pydantic import BaseModel

# Schema base para o usuário
class UserBase(BaseModel):
    email: str

# Schema para a criação de um usuário (recebe a senha)
class UserCreate(UserBase):
    password: str

# Schema para a leitura de um usuário (não retorna a senha)
class User(UserBase):
    id: int

    class Config:
        from_attributes = True # Permite que o Pydantic leia dados de objetos SQLAlchemy

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None

class FavoriteRecipeBase(BaseModel):
    recipe_id: int
    recipe_title: str
    recipe_image_url: str

class FavoriteRecipeCreate(FavoriteRecipeBase):
    pass

class FavoriteRecipe(FavoriteRecipeBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True