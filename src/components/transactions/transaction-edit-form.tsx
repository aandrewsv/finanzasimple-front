// src/components/transactions/transaction-edit-form.tsx
"use client"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { theme } from "@/lib/theme"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { CategorySelector } from "@/components/app/category-selector"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useToast } from "@/hooks/use-toast"
import type { Transaccion } from "@/lib/api"
import { actualizarTransaccion } from "@/lib/api"

interface TransactionEditFormProps {
  transaction: Transaccion
  isOpen: boolean
  onClose: () => void
  onSaved: () => void
}

export function TransactionEditForm({
  transaction,
  isOpen,
  onClose,
  onSaved,
}: TransactionEditFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [monto, setMonto] = useState(transaction.monto.toString())
  const [categoria, setCategoria] = useState(transaction.categoria._id)
  const [descripcion, setDescripcion] = useState(transaction.descripcion)
  const [fecha, setFecha] = useState<Date>(new Date(new Date(transaction.fecha).getTime() + new Date(transaction.fecha).getTimezoneOffset() * 60000)) // Adjust for timezone

  const isMobile = useMediaQuery("(max-width: 768px)")
  const { toast } = useToast()

  useEffect(() => {
    const formattedAmount = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(transaction.monto)
    setMonto(formattedAmount)
  }, [transaction.monto])

  // Formatea el monto mientras el usuario escribe
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    if (value) {
      const number = parseInt(value)
      setMonto(new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(number))
    } else {
      setMonto('')
    }
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate.getTime())) {
      setFecha(newDate);
    } else {
      setFecha(new Date());
    }
  }

  // Función de utilidad para convertir string formateado a número
  const parseFormattedAmount = (formattedAmount: string): number => {
    const numericString = formattedAmount.replace(/[^0-9]/g, '');
    return parseInt(numericString, 10);
  };

  const handleSubmit = async () => {
    if (!monto || !categoria) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El monto y la categoría son obligatorios",
      })
      return
    }

    try {
      setIsLoading(true)
      const montoNumerico = parseFormattedAmount(monto)

      await actualizarTransaccion(transaction._id, {
        monto: montoNumerico,
        categoria,
        descripcion,
        fecha: fecha.toISOString(),
        tipo: transaction.tipo
      })

      toast({
        title: "Transacción actualizada",
        description: "Los cambios se han guardado correctamente",
      })

      onSaved(); // Ensure this is called after saving
      onClose()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar la transacción. Intenta de nuevo.",
      })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const Content = (
    <div className="space-y-6">
      {/* Monto */}
      <div className="space-y-2">
        <label className={cn("text-sm font-medium", theme.colors.text.muted)}>
          Monto
        </label>
        <Input
          value={monto}
          onChange={handleAmountChange}
          placeholder="$0"
          className={cn(
            "text-xl font-semibold text-center h-12",
            theme.colors.background.main,
            theme.colors.border.main,
            transaction.tipo === 'ingreso' ? "text-green-600 dark:text-green-500" : "text-red-500 dark:text-red-500"
          )}
        />
      </div>

      {/* Categoría */}
      <div className="space-y-2">
        <label className={cn("text-sm font-medium", theme.colors.text.muted)}>
          Categoría
        </label>
        <CategorySelector
          type={transaction.tipo}
          value={categoria}
          onChange={setCategoria}
        />
      </div>

      {/* Date Picker */}
      <div className="space-y-2">
        <label className={cn("text-sm font-medium", theme.colors.text.muted)}>
          Fecha
        </label>
        <Input
          type="date"
          value={fecha.toISOString().split('T')[0]}
          onChange={handleDateChange}
          className={cn(
            "w-full px-4 py-2 rounded-md text-sm",
            theme.colors.background.main,
            theme.colors.border.main,
            theme.colors.text.primary,
            "focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          )}
        />
      </div>

      {/* Descripción */}
      <div className="space-y-2">
        <label className={cn("text-sm font-medium", theme.colors.text.muted)}>
          Descripción (opcional)
        </label>
        <Input
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción de la transacción"
        />
      </div>

      {/* Botones */}
      <div className="flex gap-2 justify-end">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
        >
          Guardar cambios
        </Button>
      </div>
    </div>
  )

  return isMobile ? (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle>Editar transacción</SheetTitle>
        </SheetHeader>
        {Content}
      </SheetContent>
    </Sheet>
  ) : (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar transacción</DialogTitle>
        </DialogHeader>
        {Content}
      </DialogContent>
    </Dialog>
  )
}