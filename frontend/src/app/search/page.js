// frontend/src/app/search/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Importa o router para navegação
import styles from './page.module.css';

export default function SearchPage() {
  const router = useRouter(); // Inicializa o router

  const [currentIngredient, setCurrentIngredient] = useState('');
  const [ingredientsList, setIngredientsList] = useState([]);

  const handleAddIngredient = (e) => {
    e.preventDefault();
    if (currentIngredient && !ingredientsList.includes(currentIngredient.trim())) {
      setIngredientsList([...ingredientsList, currentIngredient.trim()]);
      setCurrentIngredient(''); // Limpa o input
    }
  };

  const handleRemoveIngredient = (ingredientToRemove) => {
    setIngredientsList(ingredientsList.filter(ing => ing !== ingredientToRemove));
  };

  const handleSearch = () => {
    if (ingredientsList.length > 0) {
      const ingredientsQuery = ingredientsList.join(',');
      router.push(`/results?ingredients=${ingredientsQuery}`);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Tell us your ingredients</h1>

        <form onSubmit={handleAddIngredient} className={styles.form}>
          <input
            type="text"
            value={currentIngredient}
            onChange={(e) => setCurrentIngredient(e.target.value)}
            placeholder="e.g., tomato"
            className={styles.input}
          />
          <button type="submit" className={styles.addButton}>
            Add
          </button>
        </form>

        <div className={styles.ingredientsList}>
          {ingredientsList.map(ingredient => (
            <div key={ingredient} className={styles.ingredientTag}>
              {ingredient}
              <button onClick={() => handleRemoveIngredient(ingredient)} className={styles.removeButton}>
                &times;
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleSearch}
          disabled={ingredientsList.length === 0}
          className={styles.searchButton}
        >
          Search Recipes
        </button>
      </div>
    </main>
  );
}