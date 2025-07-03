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
  selectedMonth: number
  selectedYear: number
}

export function ExportButton({ vehicles, selectedMonth, selectedYear }: ExportButtonProps) {
  const exportToXLSX = () => {
    // Cabeçalho
    const headers = ["Placa", "Modelo", "Contrato Meli", "Categoria", "Base", "Coordenador", "Gerente", "Tipo Frota"]

    // Calcular número de dias no mês selecionado
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate()
    const monthStr = (selectedMonth + 1).toString().padStart(2, "0")

    // Adicionar dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      headers.push(`${day.toString().padStart(2, "0")}/${monthStr}`)
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

      // Adicionar status de cada dia do mês selecionado
      for (let day = 1; day <= daysInMonth; day++) {
        const dayStr = day.toString().padStart(2, "0")
        const dayData = vehicle.dailyStatus[dayStr] || { status: "sem-rota", routeInfo: null }
        const status = dayData.status
        row[`${dayStr}/${monthStr}`] = getStatusLabel(status)
      }

      // Calcular estatísticas baseadas apenas nos dias do mês selecionado
      const totalPossibleDays = daysInMonth
      const workedDays = Object.keys(vehicle.dailyStatus)
        .filter(day => parseInt(day) <= daysInMonth)
        .filter(day => vehicle.dailyStatus[day]?.status === "rodou").length
      const percentage = totalPossibleDays > 0 ? Math.round((workedDays / totalPossibleDays) * 100) : 0

      row["Total Dias"] = workedDays
      row["Percentual"] = `${percentage}%`

      return row
    })

    // Criar workbook e worksheet
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Controle de Rodagem")

    // Gerar nome do arquivo com mês e ano corretos
    const monthNames = [
      "janeiro", "fevereiro", "março", "abril", "maio", "junho",
      "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
    ]
    const monthName = monthNames[selectedMonth]
    const filename = `controle-rodagem-${monthName}-${selectedYear}.xlsx`

    // Download
    XLSX.writeFile(wb, filename)
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
  // Simplifica para apenas "Rodou" e "Não rodou"
  return status === "rodou" ? "Rodou" : "Não rodou"
}
