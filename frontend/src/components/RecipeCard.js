// frontend/src/components/RecipeCard.js
'use client';
import Image from 'next/image';
import Link from 'next/link';
import styles from './RecipeCard.module.css';

export default function RecipeCard({ recipe }) {
  // Por agora, o link aponta para uma página que ainda não existe.
  return (
    <Link href={`/recipe/${recipe.id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image 
          src={recipe.image}
          alt={recipe.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover" 
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{recipe.title}</h3>
        <div className={styles.details}>
          {recipe.readyInMinutes && (
            <span className={styles.detailItem}>
              ⏰ {recipe.readyInMinutes} min
            </span>
          )}
          {recipe.servings && (
            <span className={styles.detailItem}>
              👥 {recipe.servings} servings
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}