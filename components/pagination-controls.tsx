"use client"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  itemsPerPage: number
  totalItems: number
  startIndex: number
  endIndex: number
  onPageChange: (page: number) => void
  onItemsPerPageChange: (itemsPerPage: number) => void
}

export function PaginationControls({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  startIndex,
  endIndex,
  onPageChange,
  onItemsPerPageChange
}: PaginationControlsProps) {
  
  // Gera array de páginas para mostrar
  const getVisiblePages = () => {
    const delta = 2 // Número de páginas antes e depois da atual
    const pages: (number | 'ellipsis')[] = []
    
    // Sempre mostra primeira página
    if (totalPages > 0) {
      pages.push(1)
    }
    
    // Adiciona ellipsis se necessário
    if (currentPage - delta > 2) {
      pages.push('ellipsis')
    }
    
    // Páginas ao redor da atual
    const start = Math.max(2, currentPage - delta)
    const end = Math.min(totalPages - 1, currentPage + delta)
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    // Adiciona ellipsis se necessário
    if (currentPage + delta < totalPages - 1) {
      pages.push('ellipsis')
    }
    
    // Sempre mostra última página
    if (totalPages > 1) {
      pages.push(totalPages)
    }
    
    return pages
  }

  const visiblePages = getVisiblePages()
  const showingStart = Math.min(startIndex + 1, totalItems)
  const showingEnd = Math.min(endIndex, totalItems)

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-green-500/10 transition-colors duration-300">
      <div className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          
          {/* Lado Esquerdo: Informações da página */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
              Mostrando <span className="font-semibold text-gray-900 dark:text-gray-100">{showingStart}</span> a{" "}
              <span className="font-semibold text-gray-900 dark:text-gray-100">{showingEnd}</span> de{" "}
              <span className="font-semibold text-gray-900 dark:text-gray-100">{totalItems}</span> veículos
            </div>
            
            {/* Seletor de itens por página */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">Itens por página:</span>
              <Select 
                value={itemsPerPage.toString()} 
                onValueChange={(value) => onItemsPerPageChange(Number(value))}
              >
                <SelectTrigger className="w-20 h-9 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:border-blue-500 dark:focus:border-green-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-green-500/20 text-gray-900 dark:text-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="200">200</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Lado Direito: Controles de navegação */}
          {totalPages > 1 && (
            <div className="flex justify-center lg:justify-end">
              <Pagination>
                <PaginationContent className="gap-1">
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => onPageChange(currentPage - 1)}
                      className={`${currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-blue-50 dark:hover:bg-green-900/20 hover:text-blue-700 dark:hover:text-green-400"} border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300`}
                    />
                  </PaginationItem>
                  
                  {visiblePages.map((page, index) => (
                    <PaginationItem key={index}>
                      {page === 'ellipsis' ? (
                        <PaginationEllipsis className="text-gray-500 dark:text-gray-400" />
                      ) : (
                        <PaginationLink
                          onClick={() => onPageChange(page)}
                          isActive={currentPage === page}
                          className={`cursor-pointer border-gray-300 dark:border-gray-600 ${
                            currentPage === page 
                              ? "bg-blue-600 dark:bg-green-600 text-white border-blue-600 dark:border-green-600 hover:bg-blue-700 dark:hover:bg-green-700" 
                              : "text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-green-900/20 hover:text-blue-700 dark:hover:text-green-400 hover:border-blue-300 dark:hover:border-green-600"
                          }`}
                        >
                          {page}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => onPageChange(currentPage + 1)}
                      className={`${currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-blue-50 dark:hover:bg-green-900/20 hover:text-blue-700 dark:hover:text-green-400"} border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 