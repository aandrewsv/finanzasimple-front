// src/components/transactions/transaction-balance.tsx
"use client"
import { useMemo } from "react"
import { Wallet } from "lucide-react"
import { cn } from "@/lib/utils"
import { theme } from "@/lib/theme"
import type { Transaccion } from "@/lib/api"

interface TransactionBalanceProps {
  transactions: Transaccion[]
}

export function TransactionBalance({ transactions }: TransactionBalanceProps) {
  const { balance, totalIngresos, totalGastos } = useMemo(() => {
    return transactions.reduce((acc, transaction) => {
      const amount = transaction.monto
      
      if (transaction.tipo === 'ingreso') {
        acc.totalIngresos += amount
        acc.balance += amount
      } else {
        acc.totalGastos += amount
        acc.balance -= amount
      }
      
      return acc
    }, {
      balance: 0,
      totalIngresos: 0,
      totalGastos: 0
    })
  }, [transactions])

  return (
    <div className={cn(
      "rounded-xl p-6",
      "bg-white/50 dark:bg-gray-800/50",
      "backdrop-blur-sm",
      "border border-gray-200/50 dark:border-gray-700/50"
    )}>
      <div className="flex items-start justify-between">
        <div>
          <h2 className={cn(
            "text-sm font-medium",
            theme.colors.text.muted
          )}>
            Balance
          </h2>
          <p className={cn(
            "text-3xl font-bold mt-1",
            balance >= 0 ? theme.colors.status.success : theme.colors.status.error
          )}>
            {balance >= 0 ? '+' : ''}${balance.toLocaleString('es-CO')}
          </p>
        </div>
        <div className={cn(
          "p-3 rounded-full",
          "bg-gray-100 dark:bg-gray-700"
        )}>
          <Wallet className={cn(
            "w-6 h-6",
            balance >= 0 ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
          )} />
        </div>
      </div>

      {/* Detalles */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div>
          <p className={cn(
            "text-sm font-medium",
            theme.colors.text.muted
          )}>
            Total Ingresos
          </p>
          <p className={cn(
            "text-lg font-semibold mt-1",
            theme.colors.status.success
          )}>
            +${totalIngresos.toLocaleString('es-CO')}
          </p>
        </div>
        <div>
          <p className={cn(
            "text-sm font-medium",
            theme.colors.text.muted
          )}>
            Total Gastos
          </p>
          <p className={cn(
            "text-lg font-semibold mt-1",
            theme.colors.status.error
          )}>
            -${totalGastos.toLocaleString('es-CO')}
          </p>
        </div>
      </div>
    </div>
  )
}
