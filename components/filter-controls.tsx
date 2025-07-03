"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X, Filter, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

interface FilterControlsProps {
  filters: {
    coordenador: string
    gerente: string
    placa: string
    contratoMeli: string
    categoria: string
    base: string
    tipoFrota: string
  }
  onFiltersChange: (filters: any) => void
  uniqueValues: {
    coordenadores: string[]
    gerentes: string[]
    contratosMeli: string[]
    categorias: string[]
    bases: string[]
    tiposFrota: string[]
  }
  selectedMonth: number
  onMonthChange: (month: number) => void
  selectedYear: number
  onYearChange: (year: number) => void
}

export function FilterControls({
  filters,
  onFiltersChange,
  uniqueValues,
  selectedMonth,
  onMonthChange,
  selectedYear,
  onYearChange,
}: FilterControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onFiltersChange({
      coordenador: "all",
      gerente: "all",
      placa: "",
      contratoMeli: "all",
      categoria: "all",
      base: "all",
      tipoFrota: "all",
    })
  }

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === "placa") {
      return value !== ""
    }
    return value !== "all" && value !== ""
  })

  const getMonthName = (month: number) => {
    const months = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ]
    return months[month]
  }

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-green-500/10 transition-colors duration-300">
      {/* Linha principal: Mês/Ano e Botão Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Mês/Ano - sempre visível */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">📅 Mês/Ano:</label>
          <Select value={selectedMonth.toString()} onValueChange={(value) => onMonthChange(Number.parseInt(value))}>
            <SelectTrigger className="w-48 h-9 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-green-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-green-500/20 text-gray-900 dark:text-gray-100">
              <SelectValue placeholder="Selecione o mês" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {getMonthName(i)} {selectedYear}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Botão Filtros */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 h-9 transition-colors duration-200"
          >
            <Filter size={16} />
            Filtros
            {hasActiveFilters && (
              <span className="ml-1 px-2 py-0.5 bg-blue-600 dark:bg-green-600 text-white text-xs rounded-full">
                {Object.values(filters).filter(v => v !== "all" && v !== "").length}
              </span>
            )}
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>

          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={clearFilters}
              size="sm"
              className="flex items-center gap-1 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-600 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 h-9 transition-colors duration-200"
            >
              <X size={14} />
              Limpar
            </Button>
          )}
        </div>
      </div>

      {/* Área expansível com filtros */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-4">
            {/* Primeira linha de filtros */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Coordenador</label>
                <Select value={filters.coordenador} onValueChange={(value) => handleFilterChange("coordenador", value)}>
                  <SelectTrigger className="h-9 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-green-500 text-gray-900 dark:text-gray-100">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {uniqueValues.coordenadores.filter(coord => coord && coord.trim() !== '').map((coord) => (
                      <SelectItem key={coord} value={coord}>
                        {coord}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Gerente</label>
                <Select value={filters.gerente} onValueChange={(value) => handleFilterChange("gerente", value)}>
                  <SelectTrigger className="h-9 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-green-500 text-gray-900 dark:text-gray-100">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {uniqueValues.gerentes.filter(gerente => gerente && gerente.trim() !== '').map((gerente) => (
                      <SelectItem key={gerente} value={gerente}>
                        {gerente}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Base</label>
                <Select value={filters.base} onValueChange={(value) => handleFilterChange("base", value)}>
                  <SelectTrigger className="h-9 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-green-500 text-gray-900 dark:text-gray-100">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {uniqueValues.bases.filter(base => base && base.trim() !== '').map((base) => (
                      <SelectItem key={base} value={base}>
                        {base}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Placa</label>
                <Input
                  placeholder="Ex: ABC-1234"
                  value={filters.placa}
                  onChange={(e) => handleFilterChange("placa", e.target.value)}
                  className="h-9 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-green-500 font-mono text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Segunda linha de filtros */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Contrato Meli</label>
                <Select value={filters.contratoMeli} onValueChange={(value) => handleFilterChange("contratoMeli", value)}>
                  <SelectTrigger className="h-9 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-green-500 text-gray-900 dark:text-gray-100">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {uniqueValues.contratosMeli.filter(contrato => contrato && contrato.trim() !== '').map((contrato) => (
                      <SelectItem key={contrato} value={contrato}>
                        {contrato}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Categoria</label>
                <Select value={filters.categoria} onValueChange={(value) => handleFilterChange("categoria", value)}>
                  <SelectTrigger className="h-9 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-green-500 text-gray-900 dark:text-gray-100">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {uniqueValues.categorias.filter(categoria => categoria && categoria.trim() !== '').map((categoria) => (
                      <SelectItem key={categoria} value={categoria}>
                        {categoria}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tipo Frota</label>
                <Select value={filters.tipoFrota} onValueChange={(value) => handleFilterChange("tipoFrota", value)}>
                  <SelectTrigger className="h-9 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-green-500 text-gray-900 dark:text-gray-100">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {uniqueValues.tiposFrota.filter(tipo => tipo && tipo.trim() !== '').map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>


            </div>
          </div>
        </div>
      )}
    </div>
  )
}
