"use client"

import { useState, useMemo, useEffect } from "react"
import { VehicleTrackingTable } from "@/components/vehicle-tracking-table"
import { FilterControls } from "@/components/filter-controls"
import { Legend } from "@/components/legend"
import { ExportButton } from "@/components/export-button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { PaginationControls } from "@/components/pagination-controls"
// Função para carregar dados da API
async function loadVehiclesFromAPI(selectedMonth: number, selectedYear: number): Promise<{ data: Vehicle[], message: string, source: string }> {
  try {
    const response = await fetch(`/api/vehicles?month=${selectedMonth}&year=${selectedYear}`)
    const result = await response.json()
    return result
  } catch (error) {
    console.error('❌ Erro ao carregar dados da API:', error)
    throw error
  }
}

// Interface para os dados dos veículos
interface Vehicle {
  id: number;
  placa: string;
  modelo: string;
  contratoMeli: string;
  categoria: string;
  base: string;
  coordenador: string;
  gerente: string;
  tipoFrota: string;
  dailyStatus: Record<string, any>;
}

// Estrutura baseada na Base-Veiculos.xlsx
const mockVehicles = [
  {
    id: 1,
    placa: "ABC-1234",
    modelo: "Mercedes Sprinter 415",
    contratoMeli: "CT-001-MELI",
    categoria: "Van",
    base: "Base Central SP",
    coordenador: "João Silva",
    gerente: "Ana Paula Rodrigues",
    tipoFrota: "Própria",
    dailyStatus: generateMockDailyStatus(1),
  },
  {
    id: 2,
    placa: "DEF-5678",
    modelo: "Volkswagen Crafter",
    contratoMeli: "CT-002-MELI",
    categoria: "Caminhão",
    base: "Base Norte RJ",
    coordenador: "Maria Oliveira",
    gerente: "Roberto Mendes",
    tipoFrota: "Terceirizada",
    dailyStatus: generateMockDailyStatus(2),
  },
  {
    id: 3,
    placa: "GHI-9012",
    modelo: "Iveco Daily 35S14",
    contratoMeli: "CT-003-MELI",
    categoria: "Van",
    base: "Base Sul RS",
    coordenador: "João Silva",
    gerente: "Ana Paula Rodrigues",
    tipoFrota: "Própria",
    dailyStatus: generateMockDailyStatus(3),
  },
  {
    id: 4,
    placa: "JKL-3456",
    modelo: "Mercedes Benz Atego",
    contratoMeli: "CT-004-MELI",
    categoria: "Caminhão",
    base: "Base Leste MG",
    coordenador: "Roberto Lima",
    gerente: "Carlos Alberto Silva",
    tipoFrota: "Própria",
    dailyStatus: generateMockDailyStatus(4),
  },
  {
    id: 5,
    placa: "MNO-7890",
    modelo: "Volvo VM 270",
    contratoMeli: "CT-005-MELI",
    categoria: "Caminhão",
    base: "Base Oeste PR",
    coordenador: "Maria Oliveira",
    gerente: "Roberto Mendes",
    tipoFrota: "Terceirizada",
    dailyStatus: generateMockDailyStatus(5),
  },
  {
    id: 6,
    placa: "PQR-8901",
    modelo: "Fiat Ducato",
    contratoMeli: "CT-006-MELI",
    categoria: "Van",
    base: "Base Central SP",
    coordenador: "Fernando Santos",
    gerente: "Ana Paula Rodrigues",
    tipoFrota: "Própria",
    dailyStatus: generateMockDailyStatus(6),
  },
]

// Simulação baseada na Base Rotas.xlsx
function generateMockDailyStatus(vehicleId: number) {
  const dailyStatus: Record<string, any> = {}
  
  // Dados base para rotas (simulando Base Rotas.xlsx)
  const clusters = ["Cluster Norte", "Cluster Sul", "Cluster Leste", "Cluster Oeste", "Cluster Centro"]
  const motoristas = ["Carlos Santos", "Pedro Costa", "Ana Ferreira", "José Almeida", "Luiz Barbosa", "Ricardo Pereira"]
  const modals = ["Delivery", "Express", "Standard", "Premium"]
  
  // Usar semente determinística baseada no ID do veículo
  const seed = vehicleId * 12345
  let seedValue = seed

  const seededRandom = () => {
    seedValue = (seedValue * 9301 + 49297) % 233280
    return seedValue / 233280
  }

  for (let day = 1; day <= 31; day++) {
    const dayStr = day.toString().padStart(2, "0")
    const random = seededRandom()

    let status: string
    let routeInfo = null

    // Se há data de rota na Base Rotas.xlsx = rodou
    if (random < 0.75) { // 75% chance de ter rodado
      status = "rodou"
      
      // Dados do tooltip baseados na Base Rotas.xlsx
      routeInfo = {
        idRota: `RT-${Math.floor(seededRandom() * 9000) + 1000}`,
        milha: Math.floor(seededRandom() * 200) + 50, // km rodados
        cluster: clusters[Math.floor(seededRandom() * clusters.length)],
        motorista: motoristas[Math.floor(seededRandom() * motoristas.length)],
        placaModal: modals[Math.floor(seededRandom() * modals.length)],
        performance: Math.floor(seededRandom() * 30) + 70, // 70-100%
        dataRota: `2025-07-${dayStr}`,
      }
    } else if (random < 0.85) {
      status = "manutencao"
    } else if (random < 0.90) {
      status = "folga"
    } else if (random < 0.95) {
      status = "falta"
    } else {
      status = "sem-rota"
    }

    dailyStatus[dayStr] = {
      status,
      routeInfo,
    }
  }

  return dailyStatus
}

export default function VehicleTrackingPage() {
  const [selectedMonth, setSelectedMonth] = useState(6) // Julho (0-indexed)
  const [selectedYear, setSelectedYear] = useState(2025)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const [filters, setFilters] = useState({
    coordenador: "all",
    gerente: "all",
    placa: "",
    contratoMeli: "all",
    categoria: "all",
    base: "all",
    tipoFrota: "all",
  })

  // Carrega dados da API na inicialização
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        setError(null)
        
        console.log("🚀 Carregando dados da API...")
        
        // Adiciona timeout de 30 segundos (processamento Excel é lento)
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout: API não respondeu em 30 segundos')), 30000)
        )
        
        const apiPromise = loadVehiclesFromAPI(selectedMonth, selectedYear)
        const result = await Promise.race([apiPromise, timeoutPromise]) as any
        
        setVehicles(result.data)
        console.log(`✅ ${result.data.length} veículos carregados! (${result.source})`)
        
        if (result.source === 'fallback') {
          setError(result.message)
        }
      } catch (err) {
        console.error("❌ Erro ao carregar dados da API, usando dados de fallback:", err)
        const errorMessage = err instanceof Error ? err.message : "Erro desconhecido"
        setError(`Erro ao carregar dados: ${errorMessage}. Usando dados de demonstração.`)
        setVehicles(mockVehicles)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [selectedMonth, selectedYear])

  // Filtros aplicados aos veículos
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      return (
        (!filters.coordenador || filters.coordenador === "all" || vehicle.coordenador === filters.coordenador) &&
        (!filters.gerente || filters.gerente === "all" || vehicle.gerente === filters.gerente) &&
        (!filters.placa || vehicle.placa.toLowerCase().includes(filters.placa.toLowerCase())) &&
        (!filters.contratoMeli || filters.contratoMeli === "all" || vehicle.contratoMeli === filters.contratoMeli) &&
        (!filters.categoria || filters.categoria === "all" || vehicle.categoria === filters.categoria) &&
        (!filters.base || filters.base === "all" || vehicle.base === filters.base) &&
        (!filters.tipoFrota || filters.tipoFrota === "all" || vehicle.tipoFrota === filters.tipoFrota)
      )
    })
  }, [vehicles, filters])

  // Cálculos de paginação
  const paginationData = useMemo(() => {
    const totalItems = filteredVehicles.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentItems = filteredVehicles.slice(startIndex, endIndex)

    return {
      totalItems,
      totalPages,
      currentPage,
      itemsPerPage,
      startIndex,
      endIndex,
      currentItems,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    }
  }, [filteredVehicles, currentPage, itemsPerPage])

  // Reset página quando filtros mudam
  useEffect(() => {
    setCurrentPage(1)
  }, [filters])

  // Handlers de paginação
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll suave para o topo da tabela
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1) // Reset para primeira página
  }

  const uniqueValues = useMemo(() => {
    return {
      coordenadores: [...new Set(vehicles.map((v) => v.coordenador).filter(val => val && val.trim() !== ''))].sort(),
      gerentes: [...new Set(vehicles.map((v) => v.gerente).filter(val => val && val.trim() !== ''))].sort(),
      contratosMeli: [...new Set(vehicles.map((v) => v.contratoMeli).filter(val => val && val.trim() !== ''))].sort(),
      categorias: [...new Set(vehicles.map((v) => v.categoria).filter(val => val && val.trim() !== ''))].sort(),
      bases: [...new Set(vehicles.map((v) => v.base).filter(val => val && val.trim() !== ''))].sort(),
      tiposFrota: [...new Set(vehicles.map((v) => v.tipoFrota).filter(val => val && val.trim() !== ''))].sort(),
    }
  }, [vehicles])

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <Card className="w-96 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-16 h-16 border-4 border-blue-500 dark:border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Carregando dados...</h3>
            <p className="text-gray-500 dark:text-gray-400">Aguarde um momento...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-black dark:to-gray-800 p-4 transition-colors duration-300">
      <div className="max-w-full mx-auto space-y-6">
        {error && (
          <Card className="border-yellow-200 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <span className="text-yellow-600 dark:text-yellow-400">⚠️</span>
                <p className="text-yellow-800 dark:text-yellow-300">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-green-500/10">
          <CardHeader className="pb-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col gap-2">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-500">
                  Dashboard de Atividade da Frota - {getMonthName(selectedMonth)} {selectedYear}
                </CardTitle>
              </div>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <ExportButton 
                  vehicles={filteredVehicles} 
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                            <FilterControls
              filters={filters}
              onFiltersChange={setFilters}
              uniqueValues={uniqueValues}
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
            />
              </div>
              <div className="flex-shrink-0">
                <Legend />
              </div>
            </div>
            <VehicleTrackingTable
              vehicles={paginationData.currentItems}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
            />
            
            {/* Controles de Paginação */}
            <PaginationControls
              currentPage={paginationData.currentPage}
              totalPages={paginationData.totalPages}
              itemsPerPage={paginationData.itemsPerPage}
              totalItems={paginationData.totalItems}
              startIndex={paginationData.startIndex}
              endIndex={paginationData.endIndex}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
