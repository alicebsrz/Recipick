// frontend/src/app/page.js
'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import HowItWorks from '@/components/HowItWorks';
import FeaturedRecipes from '@/components/FeaturedRecipes';
import AboutSection from '@/components/AboutSection'; // << IMPORTAR

export default function LandingPage() {
  return (
    <>
      <section className={styles.heroSection}>
        <div className={styles.container}>

          {/* Coluna da Esquerda (Texto e Botão) */}
          <div className={styles.leftColumn}>
            <h1 className={styles.title}>
              Turn What You Have Into Something Delicious
            </h1>
            <p className={styles.subtitle}>
              Type in your ingredients and discover recipes instantly.
            </p>
            <Link href="/search" className={styles.ctaButton}>
              Start Cooking
            </Link>
          </div>

          {/* Coluna da Direita (Ilustração) */}
          <div className={styles.rightColumn}>
            <Image
              src="/herosection-imagem.png" // Usando a imagem existente
              alt="Illustration of a woman holding a bowl of salad"
              width={500}
              height={500}
              priority
            />
          </div>

        </div>
      </section>

      <HowItWorks />
      <FeaturedRecipes />
      <AboutSection /> {/* << ADICIONAR O NOVO COMPONENTE */}
    </>
  );
}
