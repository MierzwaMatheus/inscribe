import React from "react";
import { useTheme } from "@/hooks/useTheme";

const ThemeToggle: React.FC = () => {
  console.log(
    "%c[ThemeToggle] Componente renderizado",
    "color: #FF5722; font-weight: bold"
  );

  const { theme, toggleTheme } = useTheme();

  const handleToggle = () => {
    console.log(
      "%c[ThemeToggle] Botão de alternância clicado",
      "color: #FF5722"
    );
    toggleTheme();
  };

  return (
    <button
      onClick={handleToggle}
      className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 shadow-md hover:shadow-lg"
      title={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
      aria-label={
        theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"
      }
    >
      {theme === "light" ? (
        // Ícone da lua para modo escuro
        <svg
          className="h-5 w-5 text-gray-600 dark:text-gray-300 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ) : (
        // Ícone do sol para modo claro
        <svg
          className="h-5 w-5 text-gray-600 dark:text-gray-300 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      )}
    </button>
  );
};

export { ThemeToggle };
export default ThemeToggle;
