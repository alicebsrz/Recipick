

# backend/main.py
import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import Annotated

from . import crud, models, schemas, security, services
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)


app = FastAPI()

# Bloco de configuração de CORS
# Lê as origens permitidas da variável de ambiente
origins = os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- LÓGICA DE AUTENTICAÇÃO E PROTEÇÃO DE ROTAS ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    email = security.verify_token(token, credentials_exception)
    user = crud.get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception
    return user

# --- ENDPOINTS PÚBLICOS ---
@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.post("/token", response_model=schemas.Token)
def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db)
):
    # --- LINHAS DE DEPURAÇÃO ---
    print("--- DENTRO DO ENDPOINT /token ---")
    print(f"Senha recebida do formulário: '{form_data.password}'")
    print(f"Tipo do dado: {type(form_data.password)}")
    print(f"Comprimento: {len(form_data.password)}")
    # --- FIM DAS LINHAS DE DEPURAÇÃO ---

    user = crud.get_user_by_email(db, email=form_data.username)
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = security.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# --- NOVO ENDPOINT PROTEGIDO ---
# --- NOVO ENDPOINT PROTEGIDO ---
@app.get("/users/me/", response_model=schemas.User)
async def read_users_me(
    current_user: Annotated[models.User, Depends(get_current_user)]
):
    return current_user

# --- ENDPOINT DE BUSCA DE RECEITAS POR INGREDIENTES ---
@app.get("/api/recipes/search")
async def search_recipes(ingredients: str): # Mudámos o nome para 'ingredients' (plural)
    """
    Endpoint para buscar receitas por múltiplos ingredientes.
    """
    if not ingredients:
        raise HTTPException(status_code=400, detail="O parâmetro 'ingredients' é obrigatório.")

    recipes = await services.search_recipes_by_ingredients(ingredients)

    if recipes is None: # Se a API falhou (ex: chave errada)
         raise HTTPException(status_code=503, detail="Erro ao comunicar com o serviço de receitas externo.")

    if not recipes: # Se a busca não encontrou nada
        raise HTTPException(status_code=404, detail=f"Nenhuma receita encontrada para os ingredientes fornecidos.")

    return recipes

# --- ENDPOINTS DE RECEITAS FAVORITAS ---
@app.post("/users/me/favorites/", response_model=schemas.FavoriteRecipe)
def add_favorite_recipe(
    favorite: schemas.FavoriteRecipeCreate,
    current_user: Annotated[models.User, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    """
    Adiciona uma receita à lista de favoritos do usuário logado.
    """
    return crud.create_user_favorite(db=db, favorite=favorite, user_id=current_user.id)

@app.delete("/users/me/favorites/{favorite_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_favorite_recipe(
    favorite_id: int,
    current_user: Annotated[models.User, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    """
    Remove uma receita da lista de favoritos do usuário logado.
    """
    db_favorite = crud.delete_user_favorite(db=db, favorite_id=favorite_id, user_id=current_user.id)
    if db_favorite is None:
        raise HTTPException(status_code=404, detail="Favorite recipe not found")
    return


@app.get("/users/me/favorites/", response_model=list[schemas.FavoriteRecipe])
def read_favorite_recipes(
    current_user: Annotated[models.User, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    """
    Retorna a lista de receitas favoritas do usuário logado.
    """
    return crud.get_user_favorites(db=db, user_id=current_user.id)

# --- ENDPOINT DE RECEITAS ALEATÓRIAS ---
@app.get("/api/recipes/random")
async def get_random_featured_recipes():
    """
    Endpoint to fetch 4 random recipes for the "Featured" section.
    """
    recipes = await services.get_random_recipes(number=4)

    if not recipes:
        raise HTTPException(status_code=404, detail="Could not fetch featured recipes at the moment.")

    return recipes

# --- ENDPOINT DE DETALHES DA RECEITA ---
@app.get("/api/recipes/{recipe_id}")
async def get_recipe_details(recipe_id: int):
    """
    Endpoint para buscar os detalhes de uma receita específica pelo seu ID.
    """
    details = await services.get_recipe_details_by_id(recipe_id)

    if details is None:
        raise HTTPException(status_code=404, detail=f"Receita com o ID {recipe_id} não encontrada ou falha na API externa.")

    return details