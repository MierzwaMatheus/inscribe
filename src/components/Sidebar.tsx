// src/components/Sidebar.tsx
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, FileText, ChevronRight } from 'lucide-react'


interface Page {
	title: string
	path: string
	order?: number
	description?: string
	tags?: string[]
}

interface Section {
	section: string;
	path?: string;
	pages: (Page | Section)[]; // Pode conter sub-seções
}

interface SidebarProps {
  docs: (Page | Section)[];
  type: 'public' | 'internal';
}

// Componente para renderizar uma página
const RenderPage: React.FC<{ page: Page; isItemActive: (path: string) => boolean }> = ({ page, isItemActive }) => {
	const isActive = isItemActive(page.path);
	return (
		<li>
			<Link
				to={page.path}
				className={`group flex items-center gap-2 p-2 rounded-md transition-all duration-200 ${
					isActive
						? 'bg-blue-100 text-blue-700 font-semibold border-l-2 border-blue-500'
						: 'text-gray-700 hover:bg-gray-100 hover:text-blue-600 hover:translate-x-1'
				}`}
			>
				<FileText size={14} className="flex-shrink-0" />
				<div className="flex-1 min-w-0">
					<div className="truncate text-sm">{page.title}</div>
				</div>
				<ChevronRight size={12} className={`flex-shrink-0 transition-transform ${isActive ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
			</Link>
		</li>
	);
};

// Componente para renderizar uma seção (e suas sub-páginas/seções)
const RenderSection: React.FC<{ section: Section; isItemActive: (path: string) => boolean }> = ({ section, isItemActive }) => (
	<div className="mb-4">
		<h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
			{section.section}
		</h3>
		<ul className="space-y-1">
			{section.pages.map((item) =>
				'section' in item ? (
					<RenderSection key={item.section} section={item as Section} isItemActive={isItemActive} />
				) : (
					<RenderPage key={item.path} page={item as Page} isItemActive={isItemActive} />
				)
			)}
		</ul>
	</div>
);

const Sidebar: React.FC<SidebarProps> = ({ docs, type }) => {
	const location = useLocation()

	console.log('%c[Sidebar] Localização atual:', 'color: #2196F3; font-weight: bold', {
		pathname: location.pathname,
		decoded: decodeURIComponent(location.pathname)
	});

	// Função para normalizar paths para comparação
	const normalizePath = (path: string): string => {
		console.log('%c[Sidebar] Normalizando path:', 'color: #4CAF50', { original: path, decoded: decodeURIComponent(path) });
		return decodeURIComponent(path);
	};

	// Função para verificar se um item está ativo
	const isItemActive = (itemPath: string): boolean => {
		const normalizedLocation = normalizePath(location.pathname);
		const normalizedItemPath = normalizePath(itemPath);
		const isActive = normalizedLocation === normalizedItemPath;
		
		console.log('%c[Sidebar] Verificando item ativo:', 'color: #FF9800', {
			itemPath,
			normalizedLocation,
			normalizedItemPath,
			isActive
		});
		
		return isActive;
	};

	return (
		<nav className="sidebar bg-gray-50 p-4 border-r border-gray-200 h-[calc(100vh-75px)] sticky top-[75px] flex flex-col justify-between">
			{/* Header da Sidebar */}
			<div className="mb-6">
				<h2 className="text-xl font-bold text-gray-800 mb-2">
					Documentação {type === 'internal' ? 'Interna' : 'Pública'}
				</h2>
				<p className="text-sm text-gray-600">Navegue pelas seções</p>
			</div>

			{/* Link para Home */}
			<div className="mb-6">
				<Link
					to="/"
					className={`flex items-center gap-2 p-2 rounded-md transition-colors ${
						location.pathname === '/'
							? 'bg-blue-100 text-blue-700 font-semibold'
							: 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
					}`}
				>
					<Home size={16} />
					<span>Início</span>
				</Link>
			</div>

			{/* Seções da Documentação */}
			<div className="space-y-4">
				{docs.map((item) =>
					'section' in item ? (
						<RenderSection key={item.section} section={item as Section} isItemActive={isItemActive} />
					) : (
						<RenderPage key={item.path} page={item as Page} isItemActive={isItemActive} />
					)
				)}
			</div>

			{/* Footer da Sidebar */}
			<div className="mt-auto pt-4 border-t border-gray-200">
				<div className="text-xs text-gray-500 text-center">
					<div className="font-medium">InBot Docs</div>
					<div>v1.0.0</div>
				</div>
			</div>
		</nav>
	)
}

export default Sidebar
