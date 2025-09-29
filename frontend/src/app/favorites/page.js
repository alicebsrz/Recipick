// frontend/src/app/favorites/page.js (Versão Final com Remoção)
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import styles from './page.module.css';

// API URL configuration
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function FavoriteRecipeCard({ recipe, token, onRemove }) {
    const handleRemove = async () => {
        if (!confirm(`Are you sure you want to remove "${recipe.recipe_title}"?`)) return;

        try {
            const response = await fetch(`${apiUrl}/users/me/favorites/${recipe.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                throw new Error("Failed to remove favorite.");
            }
            toast.success("Recipe removed!");
            onRemove(recipe.id); // Chama a função do pai para atualizar a UI
        } catch (error) {
            toast.error(error.message);
            console.error(error);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
            <Link href={`/recipe/${recipe.recipe_id}`} className="block">
                <div className="relative w-full h-48">
                    <Image src={recipe.recipe_image_url} alt={recipe.recipe_title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover" />
                </div>
            </Link>
            <div className="p-4 flex-grow flex flex-col justify-between">
                <h3 className="font-display font-bold text-lg text-foreground truncate">{recipe.recipe_title}</h3>
                <button onClick={handleRemove} className="mt-2 bg-red-500 text-white font-semibold py-1 px-3 rounded hover:bg-red-600 self-start text-sm">
                    Remove
                </button>
            </div>
        </div>
    );
}

export default function FavoritesPage() {
    const { token, authLoading } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;

        if (token) {
            const fetchFavorites = async () => {
                setIsLoading(true);
                try {
                    const response = await fetch(`${apiUrl}/users/me/favorites/`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (!response.ok) throw new Error('Failed to fetch favorites.');
                    const data = await response.json();
                    setFavorites(data);
                } catch (error) {
                    console.error(error);
                } finally {
                    setIsLoading(false);
                }
             };
             fetchFavorites();
         } else {
             setIsLoading(false);
         }
    }, [token, authLoading]);

    // Função para remover um favorito da lista no estado, sem recarregar a página
    const handleRemoveFavorite = (favoriteId) => {
        setFavorites(currentFavorites => currentFavorites.filter(fav => fav.id !== favoriteId));
    };

    if (isLoading || authLoading) {
        return <p className={styles.loadingOrError}>Loading your favorites...</p>;
    }

    if (!token) {
        return (
            <div className={styles.loadingOrError}>
                <p>You need to be logged in to view your favorites.</p>
                <Link href="/login" className="text-primary-green hover:underline font-bold">Sign In</Link>
            </div>
        );
    }

     return (
         <main className={styles.main}>
             <div className={styles.container}>
                 <h1 className={styles.title}>My Favorite Recipes</h1>
                 {favorites.length > 0 ? (
                     <div className={styles.grid}>
                         {favorites.map(fav => (
                             <FavoriteRecipeCard key={fav.id} recipe={fav} token={token} onRemove={handleRemoveFavorite} />
                         ))}
                     </div>
                 ) : (
                     // --- NOVO BLOCO PARA QUANDO NÃO HÁ FAVORITOS ---
                     <div className={styles.emptyState}>
                         <Image 
                             src="/empty-state.png" // A sua imagem da geladeira vazia
                             alt="Empty refrigerator"
                             width={150}
                             height={150}
                             className={styles.emptyImage}
                         />
                         <h2 className={styles.emptyTitle}>
                             Your Favorites is Empty
                         </h2>
                         <p className={styles.emptyDescription}>
                             Looks like you haven&rsquo;t saved any recipes yet. Let&rsquo;s find some!
                         </p>
                         <Link 
                             href="/search" 
                             className={styles.ctaButton}
                         >
                             Find Recipes
                         </Link>
                     </div>
                 )}
             </div>
         </main>
     );
 }