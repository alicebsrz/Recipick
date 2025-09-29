// frontend/src/components/Footer.js
'use client';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';
import { FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa'; // Importa os ícones

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.mainContent}>
          {/* Secção "About" */}
          <div className={styles.aboutSection}>
            <Link href="/" className={styles.logoWrapper}>
              <Image src="/logo.png" alt="Recipick Logo" width={40} height={40} />
              Recipick
            </Link>
            <p>Helping you cook smart and waste less, one ingredient at a time.</p>
          </div>

          {/* Secção de Links */}
          <div className={styles.linksGrid}>
            <div className={styles.linksColumn}>
              <h3>Navigation</h3>
              <ul>
                <li><Link href="/" className={styles.link}>Home</Link></li>
                <li><Link href="/buscar" className={styles.link}>Recipes</Link></li>
                {/* Adicione links para 'About' e 'Contact' se criar essas páginas */}
              </ul>
            </div>
            <div className={styles.linksColumn}>
              <h3>Social</h3>
              <ul className="flex gap-4">
                <li><a href="#" className={styles.link}><FaTwitter size={24} /></a></li>
                <li><a href="#" className={styles.link}><FaInstagram size={24} /></a></li>
                <li><a href="#" className={styles.link}><FaFacebook size={24} /></a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Secção de Copyright */}
        <div className={styles.copyright}>
          <p>&copy; {new Date().getFullYear()} Recipick. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}