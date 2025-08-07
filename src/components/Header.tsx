import React from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

const Header: React.FC = () => {
	const location = useLocation()
	const { user, logout } = useAuth()
	const { toast } = useToast()

	const isHomePage = location.pathname === '/'
	const isPublicRoute = location.pathname.startsWith('/public')



	const handleLogout = async () => {
		console.log('%c[Header] Iniciando processo de logout', 'color: #FF9800')
		try {
			await logout()
			console.log(
				'%c[Header] Logout realizado com sucesso',
				'color: #4CAF50; font-weight: bold'
			)
			toast({
				title: 'Logout realizado',
				description: 'Você foi desconectado com sucesso.',
			})
		} catch (error) {
			console.error(
				'%c[Header] Erro no logout:',
				'color: #F44336; font-weight: bold',
				error
			)
			toast({
				title: 'Erro',
				description: 'Erro ao fazer logout. Tente novamente.',
				variant: 'destructive',
			})
		}
	}

	return (
		<header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10 h-[75px]">
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-4">
					<div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
						<svg
							className="h-5 w-5 text-white"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
					</div>
					<h1 className="text-xl font-semibold text-gray-900">InBot Docs</h1>
				</div>

				{!isHomePage && !isPublicRoute && user && (
					<div className="flex items-center space-x-4">
						<div className="text-sm text-gray-600">
							Olá, <span className="font-medium">{user?.email}</span>
						</div>
						<button
							onClick={handleLogout}
							className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
						>
							<svg
								className="h-4 w-4 mr-2"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
								/>
							</svg>
							Sair
						</button>
					</div>
				)}
			</div>
		</header>
	)
}

export default Header
