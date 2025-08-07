import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Search, ChevronUp, ChevronDown, X } from 'lucide-react'

interface InPageSearchProps {
	htmlContent: string
}

interface SearchMatch {
	element: HTMLElement
	index: number
	context: string
}

const InPageSearch: React.FC<InPageSearchProps> = ({ htmlContent }) => {
	const [isVisible, setIsVisible] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')
	const [matches, setMatches] = useState<SearchMatch[]>([])
	const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
	const [isSearching, setIsSearching] = useState(false)
	const searchInputRef = useRef<HTMLInputElement>(null)
	const searchContainerRef = useRef<HTMLDivElement>(null)

	console.log('%c[InPageSearch] Componente inicializado', 'color: #2196F3; font-weight: bold')

	// Função para remover highlights anteriores
	const removeHighlights = useCallback(() => {
		console.log('%c[InPageSearch] Removendo highlights anteriores', 'color: #FF9800')
		const highlightedElements = document.querySelectorAll('.in-page-search-highlight')
		highlightedElements.forEach((element) => {
			const parent = element.parentNode
			if (parent) {
				parent.replaceChild(document.createTextNode(element.textContent || ''), element)
				parent.normalize()
			}
		})
	}, [])

	// Função para destacar texto
	const highlightText = useCallback((text: string, term: string): string => {
		if (!term.trim()) return text
		const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
		return text.replace(regex, '<mark class="in-page-search-highlight bg-yellow-300 text-black px-1 rounded">$1</mark>')
	}, [])

	// Função para buscar no conteúdo
	const performSearch = useCallback((term: string) => {
		console.log(`%c[InPageSearch] Realizando busca por: "${term}"`, 'color: #2196F3; font-weight: bold')
		setIsSearching(true)
		removeHighlights()

		if (!term.trim()) {
			setMatches([])
			setCurrentMatchIndex(0)
			setIsSearching(false)
			return
		}

		const contentElement = document.querySelector('.markdown-body')
		if (!contentElement) {
			console.warn('%c[InPageSearch] Elemento .markdown-body não encontrado', 'color: #FF9800')
			setIsSearching(false)
			return
		}

		const walker = document.createTreeWalker(
			contentElement,
			NodeFilter.SHOW_TEXT,
			null
		)

		const foundMatches: SearchMatch[] = []
		const nodesToReplace: { parent: HTMLElement; oldNode: Node; newHtml: string }[] = []
		let node: Node | null
		let matchIndex = 0

		// Primeira passagem: encontrar todos os matches e preparar as substituições
		while ((node = walker.nextNode())) {
			const textContent = node.textContent || ''
			const lowerTextContent = textContent.toLowerCase()
			const lowerTerm = term.toLowerCase()
			let lastIndex = 0

			while (lastIndex < textContent.length) {
				const matchPosition = lowerTextContent.indexOf(lowerTerm, lastIndex)
				if (matchPosition === -1) break

				const contextStart = Math.max(0, matchPosition - 30)
				const contextEnd = Math.min(textContent.length, matchPosition + term.length + 30)
				const context = textContent.substring(contextStart, contextEnd)

				if (node.parentElement) {
					foundMatches.push({
						element: node.parentElement,
						index: matchIndex++,
						context: `...${context}...`,
					})
				}

				lastIndex = matchPosition + term.length
			}

			if (foundMatches.length > 0 && node.parentElement) {
				const highlightedHTML = highlightText(textContent, term)
				if (highlightedHTML !== textContent) {
					nodesToReplace.push({ parent: node.parentElement, oldNode: node, newHtml: highlightedHTML })
				}
			}
		}

		// Segunda passagem: aplicar as substituições no DOM
		nodesToReplace.forEach(({ parent, oldNode, newHtml }) => {
			const tempDiv = document.createElement('div')
			tempDiv.innerHTML = newHtml
			const fragment = document.createDocumentFragment()
			while (tempDiv.firstChild) {
				fragment.appendChild(tempDiv.firstChild)
			}
			parent.replaceChild(fragment, oldNode)
		})

		console.log(`%c[InPageSearch] Encontrados ${foundMatches.length} resultados`, 'color: #4CAF50; font-weight: bold')
		setMatches(foundMatches)
		setCurrentMatchIndex(foundMatches.length > 0 ? 0 : -1)
		setIsSearching(false)

		// Navegar para o primeiro resultado
		if (foundMatches.length > 0) {
			navigateToMatch(0, foundMatches)
		}
	}, [highlightText, removeHighlights])

	// Função para navegar para um match específico
	const navigateToMatch = useCallback((index: number, matchList: SearchMatch[] = matches) => {
		if (index < 0 || index >= matchList.length) return

		console.log(`%c[InPageSearch] Navegando para resultado ${index + 1}/${matchList.length}`, 'color: #2196F3')

		// Remover destaque atual
		document.querySelectorAll('.current-search-match').forEach(el => {
			el.classList.remove('current-search-match')
		})

		// Destacar o match atual
		const currentMatch = matchList[index]
		const highlightElements = currentMatch.element.querySelectorAll('.in-page-search-highlight')
		if (highlightElements.length > 0) {
			highlightElements[0].classList.add('current-search-match', 'bg-orange-300', 'ring-2', 'ring-orange-500')
			highlightElements[0].scrollIntoView({ behavior: 'smooth', block: 'center' })
		}
	}, [matches])

	// Navegar para próximo resultado
	const nextMatch = useCallback(() => {
		if (matches.length === 0) return
		const nextIndex = (currentMatchIndex + 1) % matches.length
		setCurrentMatchIndex(nextIndex)
		navigateToMatch(nextIndex)
	}, [currentMatchIndex, matches, navigateToMatch])

	// Navegar para resultado anterior
	const previousMatch = useCallback(() => {
		if (matches.length === 0) return
		const prevIndex = currentMatchIndex === 0 ? matches.length - 1 : currentMatchIndex - 1
		setCurrentMatchIndex(prevIndex)
		navigateToMatch(prevIndex)
	}, [currentMatchIndex, matches, navigateToMatch])

	// Fechar busca
	const closeSearch = useCallback(() => {
		console.log('%c[InPageSearch] Fechando busca', 'color: #F44336')
		setIsVisible(false)
		setSearchTerm('')
		setMatches([])
		setCurrentMatchIndex(0)
		removeHighlights()
	}, [removeHighlights])

	// Interceptar Ctrl+F
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
				event.preventDefault()
				console.log('%c[InPageSearch] Ctrl+F interceptado', 'color: #2196F3')
				setIsVisible(true)
				setTimeout(() => {
					searchInputRef.current?.focus()
				}, 100)
			}

			if (isVisible) {
				if (event.key === 'Escape') {
					closeSearch()
				} else if (event.key === 'Enter') {
					event.preventDefault()
					if (event.shiftKey) {
						previousMatch()
					} else {
						nextMatch()
					}
				}
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => {
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [isVisible, closeSearch, nextMatch, previousMatch])

	// Fechar busca ao clicar fora
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
				console.log('%c[InPageSearch] Clique fora detectado, fechando busca', 'color: #F44336')
				closeSearch()
			}
		}

		if (isVisible) {
			document.addEventListener('mousedown', handleClickOutside)
		} else {
			document.removeEventListener('mousedown', handleClickOutside)
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isVisible, closeSearch])

	// Realizar busca quando o termo mudar
	useEffect(() => {
		if (isVisible) {
			const timeoutId = setTimeout(() => {
				performSearch(searchTerm)
			}, 300) // Debounce de 300ms

			return () => clearTimeout(timeoutId)
		}
	}, [searchTerm, isVisible, performSearch])

	// Limpar highlights quando o componente for desmontado
	useEffect(() => {
		return () => {
			removeHighlights()
		}
	}, [removeHighlights])

	if (!isVisible) return null

	return (
		<div ref={searchContainerRef} className="fixed top-4 right-4 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 min-w-80">
			<div className="flex items-center gap-2 mb-2">
				<Search className="w-4 h-4 text-gray-500" />
				<input
					ref={searchInputRef}
					type="text"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					placeholder="Buscar nesta página..."
					className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				/>
				<button
					onClick={closeSearch}
					className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
					title="Fechar (Esc)"
				>
					<X className="w-4 h-4" />
				</button>
			</div>

			{searchTerm && (
				<div className="flex items-center justify-between text-sm text-gray-600">
					<span>
						{isSearching ? (
							'Buscando...'
						) : matches.length > 0 ? (
							`${currentMatchIndex + 1} de ${matches.length} resultados`
						) : (
							'Nenhum resultado encontrado'
						)}
					</span>
					{matches.length > 0 && (
						<div className="flex items-center gap-1">
							<button
								onClick={previousMatch}
								className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none disabled:opacity-50"
								title="Anterior (Shift+Enter)"
								disabled={matches.length === 0}
							>
								<ChevronUp className="w-4 h-4" />
							</button>
							<button
								onClick={nextMatch}
								className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none disabled:opacity-50"
								title="Próximo (Enter)"
								disabled={matches.length === 0}
							>
								<ChevronDown className="w-4 h-4" />
							</button>
						</div>
					)}
				</div>
			)}

			{matches.length > 0 && (
				<div className="in-page-search-results-container mt-2 max-h-60 overflow-y-auto border-t border-gray-200 pt-2">
					{matches.map((match, index) => (
						<div
							key={index}
							className={`in-page-search-result-item p-2 text-sm cursor-pointer hover:bg-gray-100 rounded ${index === currentMatchIndex ? 'bg-blue-100' : ''}`}
							onClick={() => navigateToMatch(index)}
							dangerouslySetInnerHTML={{ __html: highlightText(match.context, searchTerm) }}
						/>
					))}
				</div>
			)}
		</div>
	)
}

export default InPageSearch