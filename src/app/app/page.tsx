// src/app/app/page.tsx
"use client"
import { useState } from "react"
// import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CategorySelector } from "@/components/app/category-selector"
import { theme } from "@/lib/theme"
import { useToast } from "@/hooks/use-toast"
import { transaccionesApi } from "@/lib/api"


export default function TransactionsPage() {
  const { toast } = useToast()
  const [tipo, setTipo] = useState<'ingreso' | 'egreso'>('egreso')
  const [monto, setMonto] = useState('')
  const [categoria, setCategoria] = useState('')
  const [descripcion, setDescripcion] = useState('') 

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

  // Función de utilidad para convertir string formateado a número
  const parseFormattedAmount = (formattedAmount: string): number => {
    // Elimina cualquier carácter que no sea número
    const numericString = formattedAmount.replace(/[^0-9]/g, '');
    return parseInt(numericString, 10);
  };

  // Manejar la creación de transacciones
  const handleSubmit = async () => {
    if(!monto || !categoria) return
    

    try {
      const montoNumerico = parseFormattedAmount(monto);

      await transaccionesApi.crearTransaccion({
        monto: montoNumerico,
        tipo,
        categoria,
        descripcion
      });

      toast({
        title: "Éxito",
        description: `Transacción registrada correctamente.`,
      });

      // Limpiar el formulario
      setMonto('');
      setCategoria('');
      setDescripcion('');
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Error al crear transacción",
      });
    }
  };

  return (
    <div className={cn(
      "flex-1 flex flex-col",
      theme.effects.gradient.subtle,
      "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]"
    )}>
      <div className="flex-1 flex items-start justify-center py-8">
        <div className="w-full max-w-md px-4">
          {/* Type Selector */}
          <div className={cn(
            "flex gap-2 p-1 rounded-lg mb-6",
            theme.colors.background.subtle
          )}>
            <Button
              variant="ghost"
              className={cn(
                "flex-1 flex items-center justify-center gap-2 hover:text-white dark:text-green-500 dark:hover:text-gray-600 text-green-600",
                tipo === 'ingreso' && cn(theme.colors.background.main, "shadow-sm")
              )}
              onClick={() => setTipo('ingreso')}
            >
              <Plus className={cn(
                "h-4 w-4",
                tipo === 'ingreso' ? theme.colors.status.success : theme.colors.text.muted
              )} />
              Ingreso
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "flex-1 flex items-center justify-center gap-2 hover:text-white dark:text-red-500 dark:hover:text-gray-600 text-red-600",
                tipo === 'egreso' && cn(theme.colors.background.main, "shadow-sm")
              )}
              onClick={() => setTipo('egreso')}
            >
              <Minus className={cn(
                "h-4 w-4",
                tipo === 'egreso' ? theme.colors.status.error : theme.colors.text.muted
              )} />
              Gasto
            </Button>
          </div>

          {/* Amount Input */}
          <div className="mb-6">
            <Input
              value={monto}
              onChange={handleAmountChange}
              placeholder="$0"
              className={cn(
                "text-3xl font-semibold text-center h-16",
                theme.colors.background.main,
                theme.colors.border.main,
                tipo === 'ingreso' ? "text-green-600 dark:text-green-500" : "text-red-500 dark:text-red-500"
              )}
            />
          </div>

          {/* Category Selector */}
          <CategorySelector
            type={tipo}
            value={categoria}
            onChange={setCategoria}
          />

          {/* Optional Description */}
          <div className="mt-6 mb-6">
            <Input
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción (opcional)"
              className={cn(
                theme.colors.background.main,
                theme.colors.border.main,
                theme.colors.text.primary
              )}
            />
          </div>

          {/* Submit Button */}
          <Button 
            className={cn(
              "w-full",
              theme.effects.gradient.primary,
              "text-white font-medium"
            )}
            size="lg"
            onClick={handleSubmit}
          >
            Registrar {tipo === 'ingreso' ? 'Ingreso' : 'Gasto'}
          </Button>
        </div>
      </div>
    </div>
  )
}
