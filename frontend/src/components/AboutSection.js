// frontend/src/components/AboutSection.js
'use client';

import Image from 'next/image';
import styles from './AboutSection.module.css';

export default function AboutSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>

        {/* Coluna do Texto */}
        <div className={styles.textColumn}>
          <h2 className={styles.title}>Cook Smart, Waste Less</h2>
          <div className={styles.text}>
            <p>
              Millions of tons of food are wasted every year simply because we don&rsquo;t know what to do with the ingredients we have. 
              Our mission is to change that.
            </p>
            <p>
              By helping you find delicious recipes based on what&rsquo;s already in your kitchen, we empower you to save money, reduce food waste, and discover amazing new meals.
            </p>
          </div>
        </div>

        {/* Coluna da Imagem */}
        <div className={styles.imageColumn}>
          <Image
            src="/cozinheira-feliz.png"
            alt="Happy cook illustration"
            width={400}
            height={400}
          />
        </div>

      </div>
    </section>
  );
}