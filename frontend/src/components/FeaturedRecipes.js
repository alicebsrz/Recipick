// frontend/src/components/FeaturedRecipes.js (Versão Dinâmica)
'use client';
import { useState, useEffect } from 'react'; // Importamos os hooks
import RecipeCard from './RecipeCard';
import styles from './FeaturedRecipes.module.css';

// API URL configuration
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function FeaturedRecipes() {
  // Criamos estados para gerir os dados, o carregamento e os erros
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Usamos o useEffect para buscar os dados quando o componente é montado
  useEffect(() => {
    const fetchFeaturedRecipes = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/recipes/random`);
        if (!response.ok) {
          throw new Error("Could not fetch featured recipes.");
        }
        const data = await response.json();
        setRecipes(data);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedRecipes();
  }, []); // O array vazio [] garante que isto só corre uma vez

  // Renderização condicional com base no estado
  if (isLoading) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.title}>Featured Recipes</h2>
          <p>Loading recipes...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.title}>Featured Recipes</h2>
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Featured Recipes</h2>
        <div className={styles.grid}>
          {recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>
    </section>
  );
}