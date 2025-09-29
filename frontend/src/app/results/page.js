// frontend/src/app/results/page.js
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import RecipeCard from '@/components/RecipeCard'; // Importamos o nosso card reutilizável
import styles from './page.module.css';

// API URL configuration
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// O Next.js recomenda envolver componentes que usam useSearchParams em <Suspense>
// Então, criamos um componente interno para a lógica
function SearchResults() {
  const searchParams = useSearchParams();
  const ingredients = searchParams.get('ingredients'); // Pega os ingredientes da URL

  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (ingredients) {
      const fetchRecipes = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(`${apiUrl}/api/recipes/search?ingredients=${ingredients}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "No recipes found.");
          }
          const data = await response.json();
          setRecipes(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchRecipes();
    } else {
      setError("No ingredients provided.");
      setIsLoading(false);
    }
  }, [ingredients]);

  if (isLoading) {
    return <p className={styles.loadingOrError}>Searching for recipes...</p>;
  }

  if (error) {
    return <p className={`${styles.loadingOrError} ${styles.error}`}>{error}</p>;
  }

  return (
    <div className={styles.grid}>
      {recipes.map(recipe => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}

// A nossa página principal exporta o componente envolvido em Suspense
export default function ResultsPage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Here&rsquo;s what you can make</h1>
        <Suspense fallback={<p className={styles.loadingOrError}>Loading...</p>}>
          <SearchResults />
        </Suspense>
      </div>
    </main>
  );
}