// src/components/transactions/transaction-list.tsx
// import { useEffect, useState } from "react"
import { format} from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { theme } from "@/lib/theme"
import type { Transaccion } from "@/lib/api"

interface TransactionListProps {
  ViewMode: "quick" | "custom";
  selectedTimeRange: "today" | "week" | "month" | "lastMonth";
  timeRangeOptions: { id: string; label: string }[];
  transactions: Transaccion[];
  isLoading?: boolean;
  onTransactionClick?: (transaction: Transaccion) => void;
}

interface GroupedTransactions {
  [key: string]: Transaccion[];
}

export function TransactionList({
  ViewMode,
  timeRangeOptions,
  selectedTimeRange, 
  transactions, 
  isLoading,
  onTransactionClick 
}: TransactionListProps) {
  // Agrupar transacciones por fecha
  const groupedTransactions = transactions.reduce((groups: GroupedTransactions, transaction) => {
    const date = new Date(transaction.fecha);
    const groupKey = format(date, 'yyyy-MM-dd');
    
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    
    groups[groupKey].push(transaction);
    return groups;
  }, {});

  // Formatear fecha para mostrar
//   const formatGroupDate = (dateStr: string) => {
//     const date = new Date(dateStr);
    
//     if (isToday(date)) {
//       return "Hoy";
//     } else if (isYesterday(date)) {
//       return "Ayer";
//     } else {
//       return format(date, "d 'de' MMMM", { locale: es });
//     }
//   };

  if (isLoading) {
    return <TransactionListSkeleton />;
  }

  if (transactions.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className={cn("text-sm", theme.colors.text.muted)}>
          No hay transacciones para mostrar en este período
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
      {Object.entries(groupedTransactions).map(([date, transactions]) => (
        <div key={date} className="p-4 space-y-3">
            {ViewMode === "quick" && (
            <h3 className={cn(
                "text-sm font-medium",
                theme.colors.text.secondary
            )}>
                {timeRangeOptions.find((option) => option.id === selectedTimeRange)?.label}
            </h3>
            )}
          
          <div className="space-y-2">
            {transactions.map((transaction) => (
              <TransactionItem
                key={transaction._id}
                transaction={transaction}
                onClick={() => onTransactionClick?.(transaction)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Componente para cada transacción individual
function TransactionItem({ 
  transaction,
  onClick
}: { 
  transaction: Transaccion;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-4", // Aumentado el padding
        "rounded-lg text-left transition-colors",
        "hover:bg-gray-50 dark:hover:bg-gray-800/50",
        "focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      )}
    >
      {/* Estructura en columnas para móvil */}
      <div className="space-y-2">
        {/* Fila superior: Categoría y Hora */}
        <div className="flex items-center justify-between">
          <span className={cn(
            "inline-flex px-2 py-1 rounded-full text-xs font-medium",
            "bg-gray-100 dark:bg-gray-800",
            theme.colors.text.secondary
          )}>
            {transaction.categoria.nombre}
          </span>
          <span className={cn(
            "text-xs",
            theme.colors.text.muted
          )}>
            {format(new Date(transaction.fecha), "h:mm a", { locale: es })}
          </span>
        </div>
        {/* Fila del medio: Descripción */}
        {transaction.descripcion && (
          <p className={cn(
            "text-sm line-clamp-2", // Permitimos hasta 2 líneas en móvil
            theme.colors.text.primary
          )}>
            {transaction.descripcion}
          </p>
        )}
        {/* Fila inferior: Monto */}
        <div className="flex justify-end">
          <span className={cn(
            "text-base font-semibold",
            transaction.tipo === 'ingreso' 
              ? "text-green-600 dark:text-green-500"
              : "text-red-600 dark:text-red-500"
          )}>
            {transaction.tipo === 'ingreso' ? '+' : '-'}
            ${transaction.monto.toLocaleString('es-CO')}
          </span>
        </div>
      </div>
    </button>
  );
}

// Skeleton loader
function TransactionListSkeleton() {
  return (
    <div className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
      {[...Array(3)].map((_, groupIndex) => (
        <div key={groupIndex} className="p-4 space-y-3">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="space-y-2">
            {[...Array(3)].map((_, itemIndex) => (
              <div
                key={itemIndex}
                className="p-3 rounded-lg space-y-2"
              >
                <div className="flex items-center gap-3">
                  <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                  <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
                <div className="flex justify-between items-center">
                  <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}