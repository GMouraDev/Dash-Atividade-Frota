"use client"

import { useState } from "react"
import { StatusIcon } from "./status-icon"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Info } from "lucide-react"

export function Legend() {
  const [isExpanded, setIsExpanded] = useState(false)

  const legendItems = [
    { status: "rodou", label: "Rodou", color: "text-green-600" },
    { status: "nao-rodou", label: "Não rodou", color: "text-red-600" },
  ]

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm dark:shadow-green-500/10 transition-colors duration-300">
      <div className="p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 h-auto p-2 transition-colors duration-200"
        >
          <Info size={14} className="text-blue-600 dark:text-green-500" />
          Legenda
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </Button>

        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-3">
              {/* Status dos Veículos */}
              <div>
                <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Status dos Veículos</h4>
                <div className="grid grid-cols-2 gap-2">
                  {legendItems.map((item) => (
                    <div
                      key={item.status}
                      className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600"
                    >
                      <StatusIcon status={item.status} />
                      <span className={`text-xs font-medium ${item.color} dark:${item.color === 'text-green-600' ? 'text-green-400' : 'text-red-400'}`}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cores dos Dias */}
              <div>
                <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Cores dos dias</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                    <div className="w-3 h-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-500 rounded"></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Úteis</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                    <div className="w-3 h-3 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded"></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Sábado</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                    <div className="w-3 h-3 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-500 rounded"></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Domingo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
