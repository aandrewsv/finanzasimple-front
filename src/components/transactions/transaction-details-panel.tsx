// src/components/transactions/transaction-details-panel.tsx
"use client"
import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Pencil, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { theme } from "@/lib/theme"
import { Button } from "@/components/ui/button"
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
import { useMediaQuery } from "@/hooks/use-media-query"
import { useToast } from "@/hooks/use-toast"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Transaccion } from "@/lib/api"
import { eliminarTransaccion } from "@/lib/api"

interface TransactionDetailsPanelProps {
  transaction: Transaccion | null
  isOpen: boolean
  onClose: () => void
  onEdit: (transaction: Transaccion) => void
  onDeleted: () => void
}

export function TransactionDetailsPanel({
  transaction,
  isOpen,
  onClose,
  onEdit,
  onDeleted,
}: TransactionDetailsPanelProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { toast } = useToast()

  if (!transaction) return null

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await eliminarTransaccion(transaction._id)
      
      toast({
        title: "Transacción eliminada",
        description: "La transacción se ha eliminado correctamente",
      })
      
      onDeleted()
      onClose()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar la transacción. Intenta de nuevo.",
      })
      console.error(error)
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  const handleEditClick = () => {
    onEdit(transaction);
  };

  const Content = (
    <div className="space-y-6 overflow-hidden">
      {/* Header con acciones */}
      <div className="flex justify-between items-start gap-4">
        <div className="min-w-0 flex-1">
          <h3 className={cn("text-lg font-semibold mb-1 line-clamp-2", theme.colors.text.primary)}>
            {transaction.descripcion || "Sin descripción"}
          </h3>
          <p className={cn("text-sm", theme.colors.text.muted)}>
            {format(new Date(new Date(transaction.fecha).getTime() + new Date(transaction.fecha).getTimezoneOffset() * 60000), "dd 'de' MMMM, yyyy", { locale: es })} {/* Adjust for timezone */}
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleEditClick} // Use the new handler
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Detalles */}
      <div className="space-y-4">
        <div>
          <p className={cn("text-sm font-medium", theme.colors.text.muted)}>Monto</p>
          <p className={cn(
            "text-2xl font-semibold",
            transaction.tipo === 'ingreso' 
              ? theme.colors.status.success 
              : theme.colors.status.error
          )}>
            {transaction.tipo === 'ingreso' ? '+' : '-'}
            ${transaction.monto.toLocaleString('es-CO')}
          </p>
        </div>
        <div>
          <p className={cn("text-sm font-medium mb-1", theme.colors.text.muted)}>Categoría</p>
          <div className={cn(
            "mt-1 inline-flex px-2 py-1 rounded-full text-sm",
            "bg-gray-100 dark:bg-gray-800"
          )}>
            {transaction.categoria.nombre}
          </div>
        </div>

        <div>
          <p className={cn("text-sm font-medium mb-1", theme.colors.text.muted)}>Tipo</p>
          <p className={cn("text-sm capitalize", theme.colors.text.primary)}>
            {transaction.tipo}
          </p>
        </div>
      </div>
    </div>
  )

  // Dialog de confirmación para eliminar
  const DeleteConfirmationDialog = (
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar transacción?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. La transacción será eliminada permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

  // Renderizar Sheet en móvil y Dialog en desktop
  return (
    <>
      {isMobile ? (
        <Sheet open={isOpen} onOpenChange={onClose}>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>Detalles de la transacción</SheetTitle>
            </SheetHeader>
            {Content}
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalles de la transacción</DialogTitle>
            </DialogHeader>
            {Content}
          </DialogContent>
        </Dialog>
      )}
      {DeleteConfirmationDialog}
    </>
  )
}