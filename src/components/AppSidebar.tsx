import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarTrigger,
	useSidebar,
} from '@/components/ui/sidebar'
import {
	BookOpen,
	FileText,
	Folder,
	Home,
	Settings,
	Zap,
	ChevronDown,
	ChevronRight,
} from 'lucide-react'

// Mapeamento de ícones para seções
const sectionIcons: Record<string, any> = {
	Introducao: Home,
	Tutoriais: BookOpen,
	Guias: Settings,
	API: Zap,
	default: Folder,
}

interface AppSidebarProps {
	docs: any[]
	type: 'public' | 'internal'
}

export function AppSidebar({ docs, type }: AppSidebarProps) {
	const { state } = useSidebar()
	const location = useLocation()
	const currentPath = location.pathname
	const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

	const isCollapsed = state === 'collapsed'

	// Helper para verificar se uma rota está ativa
	const isActive = (path: string) => currentPath === path

	// Helper para verificar se um grupo deve estar expandido
	const isGroupExpanded = (sectionName: string, pages: any[]) => {
		const hasActivePage = pages.some((page) => isActive(page.path))
		return hasActivePage || expandedGroups.has(sectionName)
	}

	// Toggle para expandir/contrair grupos
	const toggleGroup = (sectionName: string) => {
		const newExpanded = new Set(expandedGroups)
		if (newExpanded.has(sectionName)) {
			newExpanded.delete(sectionName)
		} else {
			newExpanded.add(sectionName)
		}
		setExpandedGroups(newExpanded)
	}

	// Classes para navegação
	const getNavClasses = ({ isActive: active }: { isActive: boolean }) =>
		active
			? 'bg-primary text-primary-foreground font-medium'
			: 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'

	return (
		<Sidebar
			className={isCollapsed ? 'w-14' : 'w-64'}
			collapsible="icon"
		>
			{/* Trigger dentro da sidebar para modo mini */}
			{isCollapsed && <SidebarTrigger className="m-2 self-end" />}

			<SidebarContent className="p-2">
				{/* Link para página inicial */}
				<SidebarGroup>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<NavLink
									to="/"
									end
									className={getNavClasses}
								>
									<Home className="h-4 w-4" />
									{!isCollapsed && <span>Início</span>}
								</NavLink>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>

				{/* Seções da documentação */}
				{docs.map((section, index) => {
					const IconComponent =
						sectionIcons[section.section] || sectionIcons.default
					const isExpanded = isGroupExpanded(section.section, section.pages)

					return (
						<SidebarGroup key={section.section}>
							<SidebarGroupLabel
								className="text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer flex items-center justify-between"
								onClick={() => !isCollapsed && toggleGroup(section.section)}
							>
								<div className="flex items-center">
									<IconComponent className="h-3 w-3 mr-2" />
									{!isCollapsed && section.section}
								</div>
								{!isCollapsed &&
									(isExpanded ? (
										<ChevronDown className="h-3 w-3" />
									) : (
										<ChevronRight className="h-3 w-3" />
									))}
							</SidebarGroupLabel>

							{(isExpanded || isCollapsed) && (
								<SidebarGroupContent>
									<SidebarMenu>
										{section.pages.map((page) => (
											<SidebarMenuItem key={page.path}>
												<SidebarMenuButton asChild>
													<NavLink
														to={page.path}
														end
														className={getNavClasses}
														title={page.title}
													>
														<FileText className="h-4 w-4" />
														{!isCollapsed && (
															<div className="flex-1 min-w-0">
																<span className="block truncate text-sm">
																	{page.title}
																</span>
																{page.description && (
																	<span className="block text-xs text-muted-foreground truncate mt-0.5">
																		{page.description}
																	</span>
																)}
															</div>
														)}
													</NavLink>
												</SidebarMenuButton>
											</SidebarMenuItem>
										))}
									</SidebarMenu>
								</SidebarGroupContent>
							)}
						</SidebarGroup>
					)
				})}

				{/* Footer da sidebar */}
				<SidebarGroup>
					<SidebarGroupContent>
						<div className="p-2 text-xs text-muted-foreground text-center">
							{!isCollapsed && (
								<>
									<div className="font-medium">Documentação InBot</div>
									<div>v1.0.0</div>
								</>
							)}
						</div>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	)
}
