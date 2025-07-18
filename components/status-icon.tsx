import { Check, X } from "lucide-react"

interface StatusIconProps {
  status: string
}

export function StatusIcon({ status }: StatusIconProps) {
  const baseClasses = "drop-shadow-sm"
  const iconSize = 14

  switch (status) {
    case "rodou":
      return <Check size={iconSize} className={`text-green-700 dark:text-green-400 ${baseClasses}`} />
    default:
      // Todos os outros status são "não rodou"
      return <X size={iconSize} className={`text-red-700 dark:text-red-400 ${baseClasses}`} />
  }
}
