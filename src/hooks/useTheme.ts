import { useState, useEffect } from 'react'

export type Theme = 'light' | 'dark'

export function useTheme() {
	console.log('%c[useTheme] Hook inicializado', 'color: #9C27B0; font-weight: bold')
	
	const [theme, setTheme] = useState<Theme>(() => {
		console.log('%c[useTheme] Verificando tema salvo no localStorage', 'color: #9C27B0')
		const savedTheme = localStorage.getItem('theme') as Theme
		const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
		const initialTheme = savedTheme || systemTheme
		console.log('%c[useTheme] Tema inicial definido:', 'color: #9C27B0', initialTheme)
		return initialTheme
	})

	useEffect(() => {
		console.log('%c[useTheme] Aplicando tema:', 'color: #9C27B0', theme)
		const root = window.document.documentElement
		
		if (theme === 'dark') {
			root.classList.add('dark')
			console.log('%c[useTheme] Classe "dark" adicionada ao HTML', 'color: #9C27B0')
		} else {
			root.classList.remove('dark')
			console.log('%c[useTheme] Classe "dark" removida do HTML', 'color: #9C27B0')
		}
		
		localStorage.setItem('theme', theme)
		console.log('%c[useTheme] Tema salvo no localStorage:', 'color: #9C27B0', theme)
	}, [theme])

	const toggleTheme = () => {
		console.log('%c[useTheme] Alternando tema. Tema atual:', 'color: #9C27B0', theme)
		const newTheme = theme === 'light' ? 'dark' : 'light'
		setTheme(newTheme)
		console.log('%c[useTheme] Novo tema definido:', 'color: #9C27B0; font-weight: bold', newTheme)
	}

	return {
		theme,
		toggleTheme,
		setTheme
	}
}