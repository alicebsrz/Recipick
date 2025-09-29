// frontend/src/components/HowItWorks.js (Nova Versão)
'use client';

import Image from 'next/image';
import styles from './HowItWorks.module.css';

export default function HowItWorks() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>How It Works</h2>
        <div className={styles.stepsGrid}>

          {/* Passo 1 */}
          <div className={styles.step}>
            <div className={styles.iconWrapper}>
              <Image src="/icon-ingredients.png" alt="Ingredients icon" width={56} height={56} />
            </div>
            <div className={styles.stepNumber}>1</div>
            <h3 className={styles.stepTitle}>Enter Your Ingredients</h3>
            <p className={styles.stepDescription}>
              Start by typing the ingredients you have on hand, separated by commas.
            </p>
          </div>

          {/* Passo 2 */}
          <div className={styles.step}>
            <div className={styles.iconWrapper}>
              <Image src="/icon-search.png" alt="Search icon" width={56} height={56} />
            </div>
            <div className={styles.stepNumber}>2</div>
            <h3 className={styles.stepTitle}>Find Recipes Instantly</h3>
            <p className={styles.stepDescription}>
              Our system will search thousands of recipes to find the perfect match for you.
            </p>
          </div>

          {/* Passo 3 */}
          <div className={styles.step}>
            <div className={styles.iconWrapper}>
              <Image src="/icon-enjoy.png" alt="Enjoy meal icon" width={56} height={56} />
            </div>
            <div className={styles.stepNumber}>3</div>
            <h3 className={styles.stepTitle}>Cook and Enjoy!</h3>
            <p className={styles.stepDescription}>
              Get inspired, follow the steps, and enjoy a delicious, no-waste meal.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}