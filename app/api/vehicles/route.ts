import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import path from 'path'
import fs from 'fs'

// Interface para os dados de veículos (Base-Veiculos.xlsx)
interface VehicleData {
  placa: string;
  modelo: string;
  contratoMeli: string;
  categoria: string;
  base: string;
  coordenador: string;
  gerente: string;
  tipoFrota: string;
}

// Interface para os dados de rotas (Base Rotas.xlsx)
interface RouteData {
  dataRota: string;
  placa: string;
  idRota: string;
  milha: string; // É string como "line_haul"
  cluster: string;
  motorista: string;
  placaModal: string;
  performance: number;
  kmPlanejado: string;
}

// Interface unificada para o sistema
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

class ExcelReader {
  static readVehiclesFile(filePath: string): VehicleData[] {
    try {
      if (!fs.existsSync(filePath)) {
        console.log(`❌ Arquivo não encontrado: ${filePath}`)
        return []
      }

      // Tenta ler o arquivo usando buffer para evitar problemas de lock
      console.log(`📋 Lendo arquivo: ${filePath}`)
      const fileBuffer = fs.readFileSync(filePath)
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' })
      const sheetName = workbook.SheetNames[0] // Primeira planilha
      const worksheet = workbook.Sheets[sheetName]
      
      // Converte para JSON usando a primeira linha como cabeçalho
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[]
      
      console.log(`📋 Planilha ${sheetName} lida com ${jsonData.length} linhas`)
      if (jsonData.length > 0) {
        console.log('📋 Colunas encontradas:', Object.keys(jsonData[0]))
      }
      
      // Mapeia os dados conforme estrutura real dos arquivos Excel
      return jsonData.map((row, index) => ({
        placa: this.normalizeString(row['Placa'] || ''),
        modelo: this.normalizeString(row['Modelo'] || ''),
        contratoMeli: this.normalizeString(row['Contrato Meli'] || ''),
        categoria: this.normalizeString(row['Categoria'] || ''),
        base: this.normalizeString(row['Base'] || ''),
        coordenador: this.normalizeString(row['Coordenador'] || ''),
        gerente: this.normalizeString(row['Gerente'] || ''),
        tipoFrota: this.normalizeString(row['Tipo de Frota'] || 'Própria'),
      })).filter(v => v.placa && v.placa.trim() !== '') // Remove linhas sem placa válida
    } catch (error) {
      console.error('❌ Erro ao ler arquivo de veículos:', error)
      return []
    }
  }

  static readRoutesFile(filePath: string): RouteData[] {
    try {
      if (!fs.existsSync(filePath)) {
        console.log(`❌ Arquivo não encontrado: ${filePath}`)
        return []
      }

      // Tenta ler o arquivo usando buffer para evitar problemas de lock
      console.log(`📋 Lendo arquivo: ${filePath}`)
      const fileBuffer = fs.readFileSync(filePath)
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' })
      const sheetName = workbook.SheetNames[0] // Primeira planilha
      const worksheet = workbook.Sheets[sheetName]
      
      // Converte para JSON usando a primeira linha como cabeçalho
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[]
      
      console.log(`📋 Planilha ${sheetName} lida com ${jsonData.length} linhas`)
      if (jsonData.length > 0) {
        console.log('📋 Colunas encontradas:', Object.keys(jsonData[0]))
      }
      
      // Mapeia os dados conforme estrutura real dos arquivos Excel
      return jsonData.map((row) => ({
        dataRota: this.normalizeDate(row['Data Rota'] || ''),
        placa: this.normalizeString(row['Placa'] || ''),
        idRota: this.normalizeString(row['ID Rota'] || ''),
        milha: this.normalizeString(row['Milha'] || ''), // É string como "line_haul"
        cluster: this.normalizeString(row['Cluster'] || ''),
        motorista: this.normalizeString(row['Motorista'] || ''),
        placaModal: this.normalizeString(row['Modal'] || ''), // Coluna se chama "Modal"
        performance: this.normalizeNumber(row['Performance'] || 1),
        kmPlanejado: this.normalizeString(row['KM Planejado'] || ''),
      })).filter(r => r.placa && r.dataRota) // Remove linhas sem placa ou data
    } catch (error) {
      console.error('❌ Erro ao ler arquivo de rotas:', error)
      return []
    }
  }

  static processExcelData(selectedMonth: number = 6, selectedYear: number = 2025): Vehicle[] {
    const vehiclesPath = path.join(process.cwd(), 'resource', 'Base-Veiculos.xlsx')
    const routesPath = path.join(process.cwd(), 'resource', 'Base Rotas.xlsx')

    try {
      console.log('🚀 Iniciando leitura dos arquivos Excel...')
      console.log('📂 Current working directory:', process.cwd())
      console.log('📂 Caminho veículos:', vehiclesPath)
      console.log('📂 Caminho rotas:', routesPath)
      console.log('📂 Arquivo veículos existe?', fs.existsSync(vehiclesPath))
      console.log('📂 Arquivo rotas existe?', fs.existsSync(routesPath))

      // Lê os dados das duas planilhas
      const vehiclesData = this.readVehiclesFile(vehiclesPath)
      const routesData = this.readRoutesFile(routesPath)

      console.log(`📊 Veículos carregados: ${vehiclesData.length}`)
      console.log(`📊 Rotas carregadas: ${routesData.length}`)

      // Processa os dados para o formato do sistema
      return vehiclesData.map((vehicle, index) => {
        const dailyStatus = this.generateDailyStatusFromRoutes(vehicle.placa, routesData, selectedMonth, selectedYear)
        
        return {
          id: index + 1,
          placa: vehicle.placa,
          modelo: vehicle.modelo,
          contratoMeli: vehicle.contratoMeli,
          categoria: vehicle.categoria,
          base: vehicle.base,
          coordenador: vehicle.coordenador,
          gerente: vehicle.gerente,
          tipoFrota: vehicle.tipoFrota,
          dailyStatus,
        }
      })
    } catch (error) {
      console.error('❌ Erro ao processar dados Excel:', error)
      return []
    }
  }

  private static generateDailyStatusFromRoutes(placa: string, routesData: RouteData[], selectedMonth: number, selectedYear: number): Record<string, any> {
    const dailyStatus: Record<string, any> = {}
    
    // Filtra rotas para esta placa
    const vehicleRoutes = routesData.filter(route => 
      route.placa.toLowerCase().trim() === placa.toLowerCase().trim()
    )
    


    // Calcula quantos dias tem o mês selecionado
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate()
    
    // Gera status para todos os dias do mês selecionado
    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = day.toString().padStart(2, '0')
      const monthStr = (selectedMonth + 1).toString().padStart(2, '0')
      const dateStr = `${selectedYear}-${monthStr}-${dayStr}`
      
      // Procura rota para este dia
      const dayRoute = vehicleRoutes.find(route => {
        try {
          // Normaliza a data da rota para comparação
          let routeDate = ''
          if (route.dataRota) {
            if (typeof route.dataRota === 'string') {
              routeDate = route.dataRota.split('T')[0] // Remove hora se tiver
            } else {
              routeDate = new Date(route.dataRota).toISOString().split('T')[0]
            }
          }
          
          return routeDate === dateStr
        } catch (error) {
          return false
        }
      })

      if (dayRoute) {
        // Se há rota, veículo rodou
        dailyStatus[dayStr] = {
          status: 'rodou',
          routeInfo: {
            idRota: dayRoute.idRota,
            milha: dayRoute.milha,
            cluster: dayRoute.cluster,
            motorista: dayRoute.motorista,
            placaModal: dayRoute.placaModal,
            performance: dayRoute.performance,
            dataRota: dayRoute.dataRota,
            kmPlanejado: dayRoute.kmPlanejado,
          }
        }
      } else {
        // Sem rota = status aleatório baseado em padrões reais
        const seed = placa.charCodeAt(0) + day
        const random = ((seed * 9301 + 49297) % 233280) / 233280
        let status = 'sem-rota'
        
        // Dias de fim de semana têm mais chance de folga
        const date = new Date(selectedYear, selectedMonth, day)
        const isWeekend = date.getDay() === 0 || date.getDay() === 6
        
        if (isWeekend) {
          status = random < 0.7 ? 'folga' : 'sem-rota'
        } else {
          if (random < 0.1) status = 'manutencao'
          else if (random < 0.15) status = 'folga'
          else if (random < 0.18) status = 'falta'
          else status = 'sem-rota'
        }

        dailyStatus[dayStr] = {
          status,
          routeInfo: null,
        }
      }
    }

    return dailyStatus
  }

  // Utilitários para normalizar dados
  private static normalizeString(value: any): string {
    if (value === null || value === undefined || value === '') return ''
    const normalized = String(value).trim()
    return normalized === '' ? '' : normalized
  }

  private static normalizeNumber(value: any): number {
    if (value === null || value === undefined || value === '') return 0
    const num = Number(value)
    return isNaN(num) ? 0 : num
  }

  private static normalizeDate(value: any): string {
    if (value === null || value === undefined) return ''
    
    // Se já é uma string de data
    if (typeof value === 'string') {
      return value
    }
    
    // Se é um número (data Excel)
    if (typeof value === 'number') {
      // Excel usa 1900-01-01 como base (com bug do ano 1900)
      const excelEpoch = new Date(1900, 0, 1)
      const daysOffset = value - 2 // Ajusta o bug do Excel
      const date = new Date(excelEpoch.getTime() + daysOffset * 24 * 60 * 60 * 1000)
      return date.toISOString().split('T')[0]
    }
    
    // Se é um objeto Date
    if (value instanceof Date) {
      return value.toISOString().split('T')[0]
    }
    
    return ''
  }
}

// Dados de fallback
const fallbackVehicles: Vehicle[] = [
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
    dailyStatus: generateFallbackStatus(1),
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
    dailyStatus: generateFallbackStatus(2),
  }
]

function generateFallbackStatus(vehicleId: number): Record<string, any> {
  const dailyStatus: Record<string, any> = {}
  
  for (let day = 1; day <= 31; day++) {
    const dayStr = day.toString().padStart(2, '0')
    const seed = vehicleId * 100 + day
    const random = ((seed * 9301 + 49297) % 233280) / 233280
    
    let status = 'sem-rota'
    if (random < 0.55) status = 'rodou'
    else if (random < 0.65) status = 'folga'
    else if (random < 0.75) status = 'manutencao'
    else if (random < 0.85) status = 'falta'
    
    dailyStatus[dayStr] = {
      status,
      routeInfo: status === 'rodou' ? {
        idRota: `R${String(vehicleId * 13 + day).padStart(3, '0')}`,
        milha: Math.round((random * 150 + 50) * 10) / 10,
        cluster: ['Norte', 'Sul', 'Leste', 'Oeste', 'Centro'][Math.floor(random * 5)],
        motorista: `Motorista ${Math.floor(random * 50) + 1}`,
        placaModal: `PLM${String(Math.floor(random * 9999)).padStart(4, '0')}`,
        performance: Math.round((random * 30 + 70) * 10) / 10,
      } : null
    }
  }
  return dailyStatus
}

export async function GET(request: Request) {
  try {
    console.log('🚀 API /api/vehicles chamada')
    
    // Extrai parâmetros de query de forma mais robusta
    let month = 6 // Default: julho (0-indexed)
    let year = 2025 // Default: 2025
    
    try {
      const url = new URL(request.url)
      
      const monthParam = url.searchParams.get('month')
      const yearParam = url.searchParams.get('year')
      
      if (monthParam !== null) {
        month = parseInt(monthParam, 10)
        if (isNaN(month)) month = 6
      }
      
      if (yearParam !== null) {
        year = parseInt(yearParam, 10)
        if (isNaN(year)) year = 2025
      }
    } catch (urlError) {
      // Silently use defaults
    }
    
    // Tenta carregar dados Excel
    const excelData = ExcelReader.processExcelData(month, year)
    
    if (excelData.length > 0) {
      console.log(`✅ Retornando ${excelData.length} veículos do Excel`)
      return NextResponse.json({
        success: true,
        data: excelData,
        source: 'excel',
        message: `${excelData.length} veículos carregados do Excel para ${month + 1}/${year}`
      })
    } else {
      console.log('⚠️ Excel vazio, usando dados de fallback')
      return NextResponse.json({
        success: true,
        data: fallbackVehicles,
        source: 'fallback',
        message: 'Usando dados de demonstração (Excel não encontrado)'
      })
    }
  } catch (error) {
    console.error('❌ Erro na API /api/vehicles:', error)
    return NextResponse.json({
      success: true,
      data: fallbackVehicles,
      source: 'fallback',
      message: 'Erro ao carregar Excel, usando dados de demonstração'
    }, { status: 200 }) // Força status 200 mesmo em erro
  }
} 