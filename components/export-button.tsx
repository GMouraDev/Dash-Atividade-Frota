"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import * as XLSX from 'xlsx'

interface Vehicle {
  id: number
  placa: string
  modelo: string
  contratoMeli: string
  categoria: string
  base: string
  coordenador: string
  gerente: string
  tipoFrota: string
  dailyStatus: Record<string, any>
}

interface ExportButtonProps {
  vehicles: Vehicle[]
}

export function ExportButton({ vehicles }: ExportButtonProps) {
  const exportToXLSX = () => {
    // Cabeçalho
    const headers = ["Placa", "Modelo", "Contrato Meli", "Categoria", "Base", "Coordenador", "Gerente", "Tipo Frota"]

    // Adicionar dias do mês
    for (let day = 1; day <= 31; day++) {
      headers.push(`${day.toString().padStart(2, "0")}/07`)
    }

    headers.push("Total Dias", "Percentual")

    // Dados
    const data = vehicles.map((vehicle) => {
      const row: any = {
        "Placa": vehicle.placa,
        "Modelo": vehicle.modelo,
        "Contrato Meli": vehicle.contratoMeli,
        "Categoria": vehicle.categoria,
        "Base": vehicle.base,
        "Coordenador": vehicle.coordenador,
        "Gerente": vehicle.gerente,
        "Tipo Frota": vehicle.tipoFrota,
      }

      // Adicionar status de cada dia
      for (let day = 1; day <= 31; day++) {
        const dayStr = day.toString().padStart(2, "0")
        const dayData = vehicle.dailyStatus[dayStr] || { status: "sem-rota", routeInfo: null }
        const status = dayData.status
        row[`${dayStr}/07`] = getStatusLabel(status)
      }

      // Calcular estatísticas
      const totalDays = Object.keys(vehicle.dailyStatus).length
      const workedDays = Object.values(vehicle.dailyStatus).filter((dayData: any) => dayData.status === "rodou").length
      const percentage = totalDays > 0 ? Math.round((workedDays / totalDays) * 100) : 0

      row["Total Dias"] = workedDays
      row["Percentual"] = `${percentage}%`

      return row
    })

    // Criar workbook e worksheet
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Controle de Rodagem")

    // Download
    XLSX.writeFile(wb, `controle-rodagem-julho-2025.xlsx`)
  }

  return (
    <Button
      onClick={exportToXLSX}
      className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 dark:from-green-600 dark:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800 text-white shadow-lg hover:shadow-xl dark:shadow-green-500/25 transition-all duration-200 transform hover:scale-105"
    >
      <Download size={16} />
      Exportar XLSX
    </Button>
  )
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    rodou: "Rodou",
    manutencao: "Manutenção",
    folga: "Folga",
    falta: "Falta",
    "sem-rota": "Sem rota",
    "sem-motorista": "Sem motorista",
  }

  return labels[status] || "Desconhecido"
}
