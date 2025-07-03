"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="sm" className="w-9 h-9 p-0">
        <div className="h-4 w-4" />
      </Button>
    )
  }

  const isDark = theme === "dark"

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-9 h-9 p-0 border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 transition-all duration-200"
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
      ) : (
        <Moon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
      )}
      <span className="sr-only">Alternar tema</span>
    </Button>
  )
} 