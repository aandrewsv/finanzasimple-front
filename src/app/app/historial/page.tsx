"use client"
import { useState, useEffect, useCallback } from "react"
import { format } from "date-fns"
// import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { getDateRangeFromTimeRange } from "@/lib/utils/dates"
import { theme } from "@/lib/theme"
import { TransactionBalance } from "@/components/transactions/transaction-balance"
import { TransactionList } from "@/components/transactions/transaction-list"
import { TransactionDetailsPanel } from "@/components/transactions/transaction-details-panel"
import { TransactionEditForm } from "@/components/transactions/transaction-edit-form"
import { fetchTransacciones, type Transaccion } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

type ViewMode = "quick" | "custom"
type TimeRange = "today" | "week" | "month" | "lastMonth"
type TransactionType = "all" | "income" | "expense"

export default function TransactionsHistoryPage() {
  // Estados de UI
  const [viewMode, setViewMode] = useState<ViewMode>("quick")
  const [timeRange, setTimeRange] = useState<TimeRange>("today")
  const [transactionType, setTransactionType] = useState<TransactionType>("all")
  const [dateRange, setDateRange] = useState({
    start: format(new Date(), "yyyy-MM-dd"),
    end: format(new Date(), "yyyy-MM-dd")
  })

  const timeRangeOptions = [
    { id: "today", label: "Hoy" },
    { id: "week", label: "Esta semana" },
    { id: "month", label: "Este mes" },
    { id: "lastMonth", label: "Mes pasado" }
  ]

  // Estados de datos
  const [transactions, setTransactions] = useState<Transaccion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaccion | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)

  const { toast } = useToast()

  // Handler para editar
  const handleEdit = () => {
    setIsEditMode(true)
  }

  // Handler para cuando se completa una acción (editar/eliminar)
  const handleActionComplete = () => {
    loadTransactions()
    setSelectedTransaction(null)
    setIsEditMode(false)
  }

 // Función para obtener el rango de fechas actual
 const getCurrentDateRange = useCallback(() => {
    if (viewMode === "quick") {
      return getDateRangeFromTimeRange(timeRange)
    }
    return dateRange
  }, [viewMode, timeRange, dateRange])

  // Función para obtener el tipo de transacción para el filtro
  const getTransactionType = useCallback(() => {
    if (transactionType === "all") return undefined
    return transactionType === "income" ? "ingreso" : "egreso"
  }, [transactionType])


 // Memoizar loadTransactions con los filtros
 const loadTransactions = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const currentDateRange = getCurrentDateRange()
      const tipo = getTransactionType()

      const data = await fetchTransacciones({
        startDate: currentDateRange.start,
        endDate: currentDateRange.end,
        tipo
      })

      setTransactions(data)
    } catch (err) {
      setError('Error al cargar las transacciones')
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar las transacciones. Intenta de nuevo más tarde."
      })
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [toast, getCurrentDateRange, getTransactionType])

  const handleTransactionClick = (transaction: Transaccion) => {
    setSelectedTransaction(transaction)
    // Aquí manejaremos la apertura del panel de detalles
  }



  // Efecto para cargar transacciones
  useEffect(() => {
    loadTransactions()
  }, [loadTransactions, timeRange, transactionType, dateRange])
  

  // Handler para cambio de vista
  const handleViewModeChange = (newMode: ViewMode) => {
    setViewMode(newMode)
    if (newMode === "quick") {
      // Al cambiar a vista rápida, establecer timeRange a today
      setTimeRange("today")
    } else {
      // Al cambiar a vista personalizada, establecer el rango a la fecha actual
      setDateRange({
        start: format(new Date(), "yyyy-MM-dd"),
        end: format(new Date(), "yyyy-MM-dd")
      })
    }
  }

  // Validar rango de fechas personalizado
  const handleDateRangeChange = (start: string, end: string) => {
    if (new Date(start) > new Date(end)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "La fecha de inicio no puede ser posterior a la fecha final"
      })
      return
    }

    // Calcular diferencia en días
    const diffTime = Math.abs(new Date(end).getTime() - new Date(start).getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays > 60) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El rango máximo permitido es de 60 días"
      })
      return
    }

    setDateRange({ start, end })
  }

  const dateInputStyles = cn(
    "px-4 py-2 rounded-md text-sm",
    "bg-gray-100/80 dark:bg-gray-800/80",
    "border border-gray-200/50 dark:border-gray-700/50",
    "text-gray-900 dark:text-gray-100",
    "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
    "[color-scheme:light] dark:[color-scheme:dark]"
  )

  return (
    <>
      {/* Historial de transacciones */}
      <div className={cn(
        "flex-1 flex flex-col",
        theme.effects.gradient.subtle,
        "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]"
      )}>
        <div className="flex-1 flex flex-col items-start justify-start py-8 px-4 md:px-8">
          <div className="w-full max-w-5xl mx-auto space-y-6">
            {/* Header y Controles */}
            <div className="mb-6">
              <h1 className={cn(
                "text-2xl font-semibold mb-6",
                theme.colors.text.primary
              )}>
                Historial de Transacciones
              </h1>

              {/* Balance Card */}
              <TransactionBalance transactions={transactions} />

              {/* Controles de visualización */}
              <div className="space-y-4 mt-4">
                {/* Toggle de tipo de transacción */}
                <div className="bg-gray-100/80 dark:bg-gray-800/80 rounded-lg p-1 w-fit">
                  <button
                    onClick={() => setTransactionType("all")}
                    className={cn(
                      "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                      "text-gray-600 dark:text-gray-400",
                      transactionType === "all" && "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                    )}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setTransactionType("income")}
                    className={cn(
                      "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                      "text-gray-600 dark:text-gray-400",
                      transactionType === "income" && "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                    )}
                  >
                    Ingresos
                  </button>
                  <button
                    onClick={() => setTransactionType("expense")}
                    className={cn(
                      "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                      "text-gray-600 dark:text-gray-400",
                      transactionType === "expense" && "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                    )}
                  >
                    Gastos
                  </button>
                </div>

                {/* Selector de modo de vista */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="bg-gray-100/80 dark:bg-gray-800/80 rounded-lg p-1 w-fit">
                    <button
                      onClick={() => handleViewModeChange("quick")}
                      className={cn(
                        "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                        "text-gray-600 dark:text-gray-400",
                        viewMode === "quick" && "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                      )}
                    >
                      Vista rápida
                    </button>
                    <button
                      onClick={() => handleViewModeChange("custom")}
                      className={cn(
                        "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                        "text-gray-600 dark:text-gray-400",
                        viewMode === "custom" && "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                      )}
                    >
                      Personalizada
                    </button>
                  </div>

                  {/* Controles específicos según el modo */}
                  {viewMode === "quick" ? (
                    <div className="flex flex-wrap gap-2">
                      {timeRangeOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setTimeRange(option.id as TimeRange)}
                          className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                            timeRange === option.id
                              ? "bg-blue-600 dark:bg-blue-500 text-white border-transparent"
                              : "bg-gray-100/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-4">
                      <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => handleDateRangeChange(e.target.value, dateRange.end)}
                        max={dateRange.end}
                        className={dateInputStyles}
                      />
                      <span className="text-sm text-gray-500 dark:text-gray-400">hasta</span>
                      <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => handleDateRangeChange(dateRange.start, e.target.value)}
                        min={dateRange.start}
                        className={dateInputStyles}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Lista de transacciones */}
            <div className={cn(
              "rounded-xl min-h-[400px]",
              "bg-gray-100/80 dark:bg-gray-800/80",
              "border border-gray-200/50 dark:border-gray-700/50"
            )}>
              {error ? (
                <div className="p-6 text-center">
                  <p className={cn("text-sm mb-4", theme.colors.status.error)}>
                    {error}
                  </p>
                  <button
                    onClick={loadTransactions}
                    className={cn(
                      "px-4 py-2 rounded-md text-sm font-medium",
                      "bg-gray-200 dark:bg-gray-700",
                      "hover:bg-gray-300 dark:hover:bg-gray-600",
                      "transition-colors"
                    )}
                  >
                    Intentar de nuevo
                  </button>
                </div>
              ) : (
                <TransactionList
                  ViewMode={viewMode}
                  selectedTimeRange={timeRange}
                  timeRangeOptions={timeRangeOptions}
                  transactions={transactions}
                  isLoading={isLoading}
                  onTransactionClick={handleTransactionClick}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Panel de detalles */}
      <TransactionDetailsPanel
        transaction={selectedTransaction}
        isOpen={!!selectedTransaction && !isEditMode}
        onClose={() => setSelectedTransaction(null)}
        onEdit={handleEdit}
        onDeleted={handleActionComplete}
      />
      {/* Formulario de edición */}
      {selectedTransaction && (
        <TransactionEditForm
          transaction={selectedTransaction}
          isOpen={isEditMode}
          onClose={() => setIsEditMode(false)}
          onSaved={handleActionComplete}
        />
      )}
    </>

  )
}