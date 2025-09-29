// frontend/src/app/layout.js
import { Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"; // << IMPORTAR
import { Toaster } from 'react-hot-toast'; // << IMPORTAR

// Configuração da fonte para títulos
const montserrat = Montserrat({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-montserrat', // Cria uma variável CSS para a fonte do título
  weight: ['700', '900']
});

// Configuração da fonte para o corpo do texto
const openSans = Open_Sans({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-open-sans', // Cria uma variável CSS para a fonte do corpo
  weight: ['400', '600']
});

export const metadata = {
  title: "Recipick", // Nome do seu logo!
  description: "Find the best recipes with what you already have.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Aplica as variáveis das fontes a toda a aplicação */}
      <body className={`${montserrat.variable} ${openSans.variable}`}>
        <AuthProvider>
          <Toaster position="bottom-center" /> {/* << ADICIONAR O TOASTER */}
          <Navbar />
          <main>{children}</main> {/* É uma boa prática envolver o conteúdo principal numa tag <main> */}
          <Footer /> {/* << ADICIONAR O FOOTER AQUI */}
        </AuthProvider>
      </body>
    </html>
  );
}
