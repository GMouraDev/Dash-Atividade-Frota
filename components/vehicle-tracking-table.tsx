"use client"

import { useMemo } from "react"
import { StatusIcon } from "./status-icon"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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

interface VehicleTrackingTableProps {
  vehicles: Vehicle[]
  selectedMonth: number
  selectedYear: number
}

export function VehicleTrackingTable({ vehicles, selectedMonth, selectedYear }: VehicleTrackingTableProps) {
  const daysOfMonth = useMemo(() => {
    const days = []
    const year = selectedYear
    const month = selectedMonth

    // Obter o número de dias no mês
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dayOfWeek = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"][date.getDay()]
      const dayStr = day.toString().padStart(2, "0")
      const monthStr = (month + 1).toString().padStart(2, "0")
      const dateStr = `${dayStr}/${monthStr}`

      days.push({
        day: dayStr,
        dayOfWeek,
        dateStr,
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        isSunday: date.getDay() === 0,
      })
    }

    return days
  }, [selectedMonth, selectedYear])

  const calculateStats = (dailyStatus: Record<string, any>) => {
    const totalDays = Object.keys(dailyStatus).length
    const workedDays = Object.values(dailyStatus).filter((dayData: any) => dayData.status === "rodou").length
    const percentage = totalDays > 0 ? Math.round((workedDays / totalDays) * 100) : 0

    return { workedDays, percentage }
  }

  return (
    <TooltipProvider>
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 shadow-xl dark:shadow-green-500/20 overflow-hidden transition-colors duration-300">
        <div className="overflow-x-auto">
          <div className="min-w-max">
            {/* Header */}
            <div className="flex bg-gradient-to-r from-slate-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 border-b-2 border-blue-100 dark:border-green-600 sticky top-0 z-10">
              {/* Fixed columns */}
                              <div className="flex bg-gradient-to-r from-slate-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 sticky left-0 z-20 border-r-2 border-blue-200 dark:border-green-600">
                <div className="w-20 px-2 py-3 text-xs font-bold text-gray-700 dark:text-gray-200 border-r border-blue-100 dark:border-gray-600 text-center">Placa</div>
                <div className="w-32 px-2 py-3 text-xs font-bold text-gray-700 dark:text-gray-200 border-r border-blue-100 dark:border-gray-600 text-center">Modelo</div>
                <div className="w-24 px-2 py-3 text-xs font-bold text-gray-700 dark:text-gray-200 border-r border-blue-100 dark:border-gray-600 text-center">
                  Contrato
                </div>
                <div className="w-20 px-2 py-3 text-xs font-bold text-gray-700 dark:text-gray-200 border-r border-blue-100 dark:border-gray-600 text-center">
                  Categoria
                </div>
                <div className="w-20 px-2 py-3 text-xs font-bold text-gray-700 dark:text-gray-200 border-r border-blue-100 dark:border-gray-600 text-center">Base</div>
                <div className="w-28 px-2 py-3 text-xs font-bold text-gray-700 dark:text-gray-200 border-r border-blue-100 dark:border-gray-600 text-center">
                  Coordenador
                </div>
                <div className="w-28 px-2 py-3 text-xs font-bold text-gray-700 dark:text-gray-200 border-r border-blue-100 dark:border-gray-600 text-center">
                  Gerente
                </div>
                <div className="w-20 px-2 py-3 text-xs font-bold text-gray-700 dark:text-gray-200 border-r border-blue-100 dark:border-gray-600 text-center">
                  Tipo
                </div>
              </div>

              {/* Day columns */}
              <div className="flex">
                {daysOfMonth.map((day) => (
                  <div
                    key={day.day}
                    className={`w-12 px-1 py-3 text-center border-r border-blue-100 dark:border-gray-600 ${
                      day.isSunday
                        ? "bg-gradient-to-b from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-800/20"
                        : day.isWeekend
                          ? "bg-gradient-to-b from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600"
                          : "bg-gradient-to-b from-white to-blue-50 dark:from-gray-800 dark:to-gray-700"
                    }`}
                  >
                    <div className="text-xs font-bold text-gray-700 dark:text-gray-200">{day.dayOfWeek}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{day.dateStr}</div>
                  </div>
                ))}
              </div>

              {/* Stats columns */}
              <div className="flex bg-gradient-to-r from-slate-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 sticky right-0 z-20 border-l-2 border-blue-200 dark:border-green-600">
                <div className="w-20 px-2 py-3 text-xs font-bold text-gray-700 dark:text-gray-200 border-r border-blue-100 dark:border-gray-600 text-center">Total</div>
                <div className="w-16 px-2 py-3 text-xs font-bold text-gray-700 dark:text-gray-200 text-center">%</div>
              </div>
            </div>

            {/* Rows */}
            {vehicles.map((vehicle, index) => {
              const stats = calculateStats(vehicle.dailyStatus)

              return (
                <div
                  key={vehicle.id}
                  className={`flex ${
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-900 hover:bg-blue-50 dark:hover:bg-green-900/20"
                      : "bg-gradient-to-r from-gray-50 to-blue-25 dark:from-gray-800 dark:to-gray-700 hover:bg-blue-50 dark:hover:bg-green-900/20"
                  } border-b border-gray-100 dark:border-gray-700 hover:shadow-md dark:hover:shadow-green-500/10 transition-all duration-200`}
                >
                  {/* Fixed columns */}
                  <div
                    className={`flex sticky left-0 z-10 border-r border-gray-200 dark:border-gray-600 ${
                      index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gradient-to-r from-gray-50 to-blue-25 dark:from-gray-800 dark:to-gray-700"
                    }`}
                  >
                    <div className="w-20 px-2 py-3 text-xs font-mono text-gray-900 dark:text-gray-100 border-r border-gray-100 dark:border-gray-600 font-bold text-center">
                      <span className="bg-gray-50 dark:bg-gray-700 rounded-md px-1 py-1">
                        {vehicle.placa}
                      </span>
                    </div>
                    <div className="w-32 px-2 py-3 text-xs text-gray-900 dark:text-gray-100 border-r border-gray-100 dark:border-gray-600 truncate text-center">
                      {vehicle.modelo}
                    </div>
                    <div className="w-24 px-2 py-3 text-xs text-gray-900 dark:text-gray-100 border-r border-gray-100 dark:border-gray-600 font-mono text-center">
                      {vehicle.contratoMeli}
                    </div>
                    <div className="w-20 px-2 py-3 text-xs text-gray-900 dark:text-gray-100 border-r border-gray-100 dark:border-gray-600 text-center">
                      <span className="px-1 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 rounded-full text-xs font-medium">
                        {vehicle.categoria}
                      </span>
                    </div>
                    <div className="w-20 px-2 py-3 text-xs text-gray-900 dark:text-gray-100 border-r border-gray-100 dark:border-gray-600 text-center">
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 rounded-full text-xs font-medium">
                        {vehicle.base}
                      </span>
                    </div>
                    <div className="w-28 px-2 py-3 text-xs text-gray-900 dark:text-gray-100 border-r border-gray-100 dark:border-gray-600 truncate text-center">
                      {vehicle.coordenador}
                    </div>
                    <div className="w-28 px-2 py-3 text-xs text-gray-900 dark:text-gray-100 border-r border-gray-100 dark:border-gray-600 truncate text-center">
                      {vehicle.gerente}
                    </div>
                    <div className="w-20 px-2 py-3 text-xs text-gray-900 dark:text-gray-100 border-r border-gray-100 dark:border-gray-600 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        vehicle.tipoFrota === "Própria" 
                          ? "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300" 
                          : "bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-300"
                      }`}>
                        {vehicle.tipoFrota}
                      </span>
                    </div>
                  </div>

                  {/* Day columns */}
                  <div className="flex">
                    {daysOfMonth.map((day) => {
                      const dayData = vehicle.dailyStatus[day.day] || { status: "sem-rota", routeInfo: null }
                      const status = dayData.status
                      const routeInfo = dayData.routeInfo

                      return (
                        <div
                          key={day.day}
                          className={`w-12 px-1 py-3 text-center border-r border-gray-100 dark:border-gray-600 flex items-center justify-center transition-all duration-200 hover:bg-blue-100 dark:hover:bg-green-900/30 ${
                            day.isSunday ? "bg-red-25 dark:bg-red-900/20" : day.isWeekend ? "bg-gray-25 dark:bg-gray-700/30" : ""
                          }`}
                        >
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="p-1 rounded-full hover:scale-110 transition-transform duration-200">
                                <StatusIcon status={status} />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="bg-gray-900 text-white border-gray-700 max-w-xs">
                              {status === "rodou" && routeInfo ? (
                                <div className="space-y-2">
                                  <p className="font-semibold text-green-400">{`${vehicle.placa} - ${day.dateStr}`}</p>
                                  <div className="text-sm space-y-1">
                                    <p>
                                      <span className="text-blue-300">🆔 ID Rota:</span> {routeInfo.idRota}
                                    </p>
                                    <p>
                                      <span className="text-blue-300">📏 Milha:</span> {routeInfo.milha} km
                                    </p>
                                    <p>
                                      <span className="text-blue-300">🏢 Cluster:</span> {routeInfo.cluster}
                                    </p>
                                    <p>
                                      <span className="text-blue-300">👨‍✈️ Motorista:</span> {routeInfo.motorista}
                                    </p>
                                    <p>
                                      <span className="text-blue-300">🚌 Placa Modal:</span> {routeInfo.placaModal}
                                    </p>
                                    <p>
                                      <span className="text-blue-300">📊 Performance:</span> {routeInfo.performance}%
                                    </p>
                                    <p className="text-xs text-gray-400">📅 {routeInfo.dataRota}</p>
                                  </div>
                                </div>
                              ) : status === "sem-rota" ? (
                                <div className="space-y-1">
                                  <p className="font-semibold text-red-400">{`${vehicle.placa} - ${day.dateStr}`}</p>
                                  <p className="text-sm text-gray-300">❌ Não houve rota para esse veículo nesse dia</p>
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  <p className="font-semibold">{`${vehicle.placa} - ${day.dateStr}`}</p>
                                  <p className="text-xs opacity-75">{getStatusLabel(status)}</p>
                                </div>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      )
                    })}
                  </div>

                  {/* Stats columns */}
                  <div
                    className={`flex sticky right-0 z-10 border-l border-gray-200 dark:border-gray-600 ${
                      index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gradient-to-r from-gray-50 to-blue-25 dark:from-gray-800 dark:to-gray-700"
                    }`}
                  >
                    <div className="w-20 px-2 py-3 text-xs font-bold text-center text-gray-900 dark:text-gray-100 border-r border-gray-100 dark:border-gray-600">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-full">{stats.workedDays}</span>
                    </div>
                    <div
                      className={`w-16 px-2 py-3 text-xs font-bold text-center ${
                        stats.percentage >= 80
                          ? "text-green-600 dark:text-green-400"
                          : stats.percentage >= 60
                            ? "text-yellow-600 dark:text-yellow-400"
                            : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      <span
                        className={`px-2 py-1 rounded-full text-white ${
                          stats.percentage >= 80
                            ? "bg-green-500 dark:bg-green-600"
                            : stats.percentage >= 60
                              ? "bg-yellow-500 dark:bg-yellow-600"
                              : "bg-red-500 dark:bg-red-600"
                        }`}
                      >
                        {stats.percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    rodou: "✓ Veículo rodou",
    "sem-rota": "✗ Não rodou",
  }
  return labels[status] || "✗ Não rodou"
}
