// frontend/src/components/Navbar.js (Versão Responsiva Final)
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { HiMenu, HiX } from 'react-icons/hi'; // Ícones de Hambúrguer e X
import styles from './Navbar.module.css';

export default function Navbar() {
    const { user, logout } = useAuth();
    const [isMounted, setIsMounted] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    if (!isMounted) {
        return (
            <header className={styles.header}>
                <nav className={styles.nav}>
                    <div className={styles.logo}>Recipick</div>
                    <div className="h-8 w-8"></div>
                </nav>
            </header>
        );
    }

    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <Link href="/" className={styles.logo}>
                    <Image src="/logo.png" alt="Recipick Logo" width={32} height={32} />
                    Recipick
                </Link>

                {/* Menu Desktop (visível em ecrãs maiores) */}
                <div className={styles.desktopMenu}>
                    {user ? (
                        <>
                            <Link href="/favorites">My Favorites</Link>
                            <span className="text-sm text-gray-500">{user.email}</span>
                            <button onClick={logout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link href="/login">Login</Link>
                            <Link href="/register" className={styles.signUpButton}>Sign Up</Link>
                        </>
                    )}
                </div>

                {/* Botão do Menu Mobile (visível em ecrãs pequenos) */}
                <button className={styles.mobileMenuButton} onClick={toggleMobileMenu}>
                    {isMobileMenuOpen ? <HiX size={30} /> : <HiMenu size={30} />}
                </button>
            </nav>

            {/* Painel do Menu Mobile Dropdown */}
            <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
                {user ? (
                    <>
                        <Link href="/favorites" onClick={toggleMobileMenu}>My Favorites</Link>
                        <button onClick={() => { logout(); toggleMobileMenu(); }}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link href="/login" onClick={toggleMobileMenu}>Login</Link>
                        <Link href="/register" className={styles.signUpButton} onClick={toggleMobileMenu}>Sign Up</Link>
                    </>
                )}
            </div>
        </header>
    );
}