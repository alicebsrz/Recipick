// frontend/src/app/recipe/[id]/page.js (Versão Final com Botão de Favoritos)
'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext'; // Importamos a autenticação
import toast from 'react-hot-toast'; // Importamos o toast
import { useParams } from 'next/navigation'; // << 1. IMPORTE O HOOK
import styles from './page.module.css';

// API URL configuration
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function RecipeDetailsPage() { // << 2. REMOVA O { params } DAQUI
  const { id } = useParams(); // << 3. USE O HOOK PARA PEGAR O ID
  const { token, user } = useAuth(); // Pegamos o token e user para fazer o pedido
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchRecipeDetails = async () => {
        try {
          const response = await fetch(`${apiUrl}/api/recipes/${id}`);
          if (!response.ok) throw new Error("Recipe not found");
          const data = await response.json();
          setRecipe(data);
        } catch (error) {
          console.error("Failed to fetch recipe details:", error);
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchRecipeDetails();
    }
  }, [id]);

  const handleSaveFavorite = async () => {
    if (!token) {
      toast.error("You must be logged in to save a recipe.");
      return;
    }
    
    // Debug: vamos verificar se temos todos os dados necessários
    console.log("Token:", token ? "✅ Present" : "❌ Missing");
    console.log("Recipe ID:", recipe?.id);
    console.log("Recipe Title:", recipe?.title);
    
    try {
      const response = await fetch(`${apiUrl}/users/me/favorites/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          recipe_id: parseInt(recipe.id), // Garantir que é um número
          recipe_title: recipe.title,
          recipe_image_url: recipe.image
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        
        // Tratamento específico para erro de autenticação
        if (response.status === 401) {
          toast.error("Your session has expired. Please log in again.");
        } else {
          toast.error(errorData.detail || "Failed to save recipe.");
        }
        return;
      }
      
      toast.success(`Recipe "${recipe.title}" saved successfully!`);
    } catch (error) {
      console.error("Failed to save favorite:", error);
      toast.error("Network error. Please try again.");
    }
  };

  if (isLoading) return <p className="text-center p-10 font-sans text-lg">Loading recipe details...</p>;
  if (error || !recipe) return <p className="text-center p-10 font-sans text-lg text-red-500">Could not load the recipe.</p>;

  const cleanInstructions = recipe.instructions?.replaceAll('<ol>', '').replaceAll('</ol>', '').replaceAll('<li>', '<li class="mb-4">');

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>{recipe.title}</h1>

        <div className={styles.summary}>
          {recipe.readyInMinutes && <span>⏰ **Ready in:** {recipe.readyInMinutes} minutes</span>}
          {recipe.servings && <span>👥 **Serves:** {recipe.servings}</span>}
        </div>

        <Image 
          src={recipe.image}
          alt={recipe.title}
          width={800}
          height={600}
          className={styles.image}
          priority
        />

        {/* Botão de Adicionar Favorito */}
        <div className="flex justify-center my-6">
          {token && user ? (
            <button
              onClick={handleSaveFavorite}
              className="bg-accent-orange text-white font-bold font-display py-3 px-8 rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-105"
            >
              ⭐ Add to Favorites
            </button>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 mb-2">You must be logged in to save favorites</p>
              <button
                onClick={() => toast.info("Please log in to save your favorite recipes!")}
                className="bg-gray-300 text-gray-700 font-bold font-display py-3 px-8 rounded-full cursor-not-allowed"
                disabled
              >
                🔒 Login Required
              </button>
            </div>
          )}
        </div>

        <h2 className={styles.sectionTitle}>Ingredients</h2>
        <ul className={styles.ingredientsList}>
          {recipe.extendedIngredients?.map((ing, index) => (
            // Combina o ID do ingrediente com o seu índice na lista
            <li key={`${ing.id}-${index}`} className={styles.ingredientItem}>
              <span className={styles.ingredientQuantity}>{ing.amount?.toFixed ? ing.amount.toFixed(2) : ing.amount} {ing.unit}</span>
              <span className={styles.ingredientName}>{ing.name}</span>
            </li>
          ))}
        </ul>

        <h2 className={styles.sectionTitle}>Instructions</h2>
        <div 
            className={styles.instructions} 
            dangerouslySetInnerHTML={{ __html: `<ol>${cleanInstructions}</ol>` }} 
        />
      </div>
    </main>
  );
}