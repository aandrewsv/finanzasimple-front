// src/app/components/transactions/category-selector.tsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  Check, 
  ChevronDown, 
  Pencil, 
  Plus, 
  Trash2, 
  Loader2, 
  Eye, 
  EyeOff, 
  Settings2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast";
import { categoriasApi } from '@/lib/api';
import type { Categoria } from "@/lib/api";
import { cn } from "@/lib/utils";
import { theme } from "@/lib/theme";



type TransactionType = "ingreso" | "egreso";

interface CategorySelectorProps {
  type: TransactionType;
  value: string;
  onChange: (value: string) => void;
}

interface CategoryManagerState {
  isOpen: boolean;
  mode: 'view' | 'edit';
  editingCategory: string | null;
  editValue: string;
  deletingCategory: Categoria | null;
  isLoading: boolean;
  isLoadingAction: boolean;
}


export function CategorySelector({ type, value, onChange }: CategorySelectorProps) {
  const [state, setState] = useState<CategoryManagerState>({
    isOpen: false,
    mode: 'view',
    editingCategory: null,
    editValue: "",
    deletingCategory: null,
    isLoading: false,
    isLoadingAction: false
  });
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [hiddenCategories, setHiddenCategories] = useState<Set<string>>(new Set());
  const [newCategoryName, setNewCategoryName] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  // const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Función helper para actualizar estado parcialmente
  const updateState = (updates: Partial<CategoryManagerState>) => {
    setState(current => ({ ...current, ...updates }));
  };

  const handleCategoriesSettingsClick = () => {
    updateState({ mode: state.mode === 'view' ? 'edit' : 'view' }) 
    updateState({ isOpen: true });
  }

  // Filtrar categorías basado en visibilidad
  const filteredCategories = useMemo(() => {
    if (state.mode === 'view') {
      return categories.filter((cat: Categoria) => !hiddenCategories.has(cat._id));
    }
    return categories;
  }, [categories, hiddenCategories, state.mode]);

  // Toggle de visibilidad de categoría
  const toggleCategoryVisibility = async (categoryId: string) => {
    try {
        updateState({ isLoadingAction: true });
        const categoria = categories.find((cat: Categoria) => cat._id === categoryId);
        
        if (!categoria || categoria.isDefault) return;

        const isCurrentlyVisible = !hiddenCategories.has(categoryId);
        
        await categoriasApi.actualizarVisibilidad(categoryId, !isCurrentlyVisible);
        
        setHiddenCategories(prev => {
            const updated = new Set<string>(prev);
            if (isCurrentlyVisible) {
                updated.add(categoryId);
            } else {
                updated.delete(categoryId);
            }
            return updated;
        });
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "No se pudo actualizar la visibilidad de la categoría"
        });
        console.error(error);
    } finally {
        updateState({ isLoadingAction: false });
    }
  };




  const selectedCategory = categories.find(cat => cat._id === value);

  // Cargar categorías
  useEffect(() => {
    const loadCategories = async () => {
        updateState({ isLoading: true });
        try {
            const data = await categoriasApi.fetchCategorias();
            const filteredCategories = data.filter((cat: Categoria) => cat.tipo === type);
            setCategories(filteredCategories);
            
            // Inicializar hiddenCategories con las categorías no visibles
            const hiddenCategoryIds = filteredCategories
                .filter((cat: Categoria) => !cat.isVisible)
                .map((cat: Categoria) => cat._id);
              
                setHiddenCategories(new Set<string>(hiddenCategoryIds));
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : "Error al cargar categorías",
            });
        } finally {
            updateState({ isLoading: false });
        }
    };
    loadCategories();
}, [type, toast]);

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        updateState({ isOpen: false });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Manejar la creación de categorías
  const handleCreate = async () => {
    if (!newCategoryName.trim()) return;

    updateState({ isLoading: true });
    try {
      const nuevaCategoria = await categoriasApi.crearCategoria({
        nombre: newCategoryName.trim(),
        tipo: type,
        orden: categories.length + 1,
      });

      setCategories(prev => [...prev, nuevaCategoria]);
      onChange(nuevaCategoria._id);
      setNewCategoryName("");
      toast({
        title: "Éxito",
        description: `Categoría "${nuevaCategoria.nombre}" creada.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Error al crear categoría",
      });
    } finally {
      updateState({ isLoading: false });

    }
  };

  // Manejar la eliminación de categorías con confirmación
  const handleDelete = async (categoria: Categoria) => {
    try {
      updateState({ isLoadingAction: true });
      await categoriasApi.eliminarCategoria(categoria._id);
      
      setCategories(prev => prev.filter(cat => cat._id !== categoria._id));
      if (value === categoria._id) onChange("");
      
      toast({
        title: "Categoría eliminada",
        description: `Las transacciones se han movido a "${type === 'ingreso' ? '✨ Otros Ingresos' : '📝 Otros Gastos'}"`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Error al eliminar categoría",
      });
    } finally {
      updateState({ isLoadingAction: false, deletingCategory: null });
    }
  };


  // Manejar la edición de categorías
  const handleEdit = async (categoria: Categoria) => {
    if (!state.editValue.trim() || state.editValue === categoria.nombre) {
      updateState({ editingCategory: null });
      return;
    }

    try {
      const updatedCategoria = await categoriasApi.actualizarCategoria(
        categoria._id,
        { nombre: state.editValue.trim() }
      );

      setCategories(prev => prev.map(cat => 
        cat._id === categoria._id ? updatedCategoria : cat
      ));
      
      toast({
        title: "Éxito",
        description: `Categoría actualizada a "${updatedCategoria.nombre}".`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Error al actualizar categoría",
      });
    } finally {
      updateState({ editingCategory: null });
    }
  };


  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Botón principal */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={state.isOpen}
          className={cn(
            "w-full justify-between",
            theme.colors.background.main,
            theme.colors.border.main,
            theme.colors.text.primary,
            "hover:bg-gray-50 dark:hover:bg-gray-800",
            selectedCategory?.isDefault && theme.colors.text.muted
          )}
          onClick={() => updateState({ isOpen: !state.isOpen })}
          disabled={state.isLoading}
        >
          <span className="flex items-center gap-2 truncate">
            {state.isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : selectedCategory ? (
              selectedCategory.nombre
            ) : (
              "Seleccionar categoría..."
            )}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
        {/* Botón de configuración en una posición más natural */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "flex-shrink-0",
            "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
            state.mode === 'edit' && "text-blue-600 dark:text-blue-400"
          )}
          onClick={handleCategoriesSettingsClick}
        >
          <Settings2 className="h-4 w-4" />
        </Button>
      </div>

      {state.isOpen && (
        <div className={cn(
          "fixed md:absolute left-0 md:left-auto right-0 md:right-auto bottom-0 md:bottom-auto",
          "md:mt-2 w-full md:w-auto min-w-full",
          "rounded-t-lg md:rounded-lg border shadow-lg z-50",
          "bg-white dark:bg-gray-900",
          "backdrop-blur-lg bg-opacity-95 dark:bg-opacity-95",
          "shadow-lg dark:shadow-gray-900/20",
          theme.colors.border.main,
          "md:max-w-[400px]" // Limitar ancho en desktop
        )}>


          {/* Header con título contextual */}
          <div className={cn(
            "sticky top-0 p-3 border-b flex items-center justify-between",
            theme.colors.border.main,
            "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm"
          )}>
            <h3 className={cn(
              "text-sm font-medium",
              theme.colors.text.primary
            )}>
              {state.mode === 'edit' ? 'Gestionar Categorías' : 'Seleccionar Categoría'}
            </h3>
            {state.mode === 'edit' && (
              <button
                className={cn(
                  "text-xs",
                  theme.colors.text.accent,
                  "hover:underline"
                )}
                onClick={() => updateState({ mode: 'view' })}
              >
                Listo
              </button>
            )}
          </div>

          {/* Lista de categorías */}
          <div className="p-2 space-y-2">
            {/* Nueva categoría (solo en modo edición) */}
            {state.mode === 'edit' && (
              <div className={cn(
                "flex gap-2 p-2 rounded-lg",
                "bg-gray-50/50 dark:bg-gray-800/50",
                "border border-dashed",
                theme.colors.border.subtle
              )}>
                <Input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Nueva categoría..."
                  className="flex-1"
                  disabled={state.isLoadingAction}
                />
                <Button
                  size="sm"
                  onClick={handleCreate}
                  disabled={!newCategoryName.trim() || state.isLoadingAction}
                  className={theme.effects.gradient.primary}
                >
                  {state.isLoadingAction ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}

            {/* Categorías personalizadas */}
            {filteredCategories.map(categoria => (
              <div
                key={categoria._id}
                className={cn(
                  "relative group",
                  "rounded-lg transition-colors",
                  state.mode === 'view' && [
                    "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                    value === categoria._id && "bg-gray-50 dark:bg-gray-800/50"
                  ]
                )}
              >
                {state.mode === 'edit' ? (
                  // Modo edición
                  <div className={cn(
                    "flex items-center p-2 rounded-lg",
                    "bg-gray-50/50 dark:bg-gray-800/50"
                  )}>
                    <span className={cn(
                      "flex-1 truncate",
                      categoria.isDefault && "opacity-75"
                    )}>
                      {categoria.nombre}
                    </span>
                    <div className="flex items-center gap-2">
                      {!categoria.isDefault && (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => updateState({
                              editingCategory: categoria._id,
                              editValue: categoria.nombre
                            })}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => updateState({ deletingCategory: categoria })}
                          >
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </Button>
                        </>
                      )}
                      <button
                        className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                        onClick={() => toggleCategoryVisibility(categoria._id)}
                      >
                        {hiddenCategories.has(categoria._id) ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  // Modo selección
                  <button
                    className="w-full p-2 text-left"
                    onClick={() => {
                      onChange(categoria._id);
                      updateState({ isOpen: false });
                    }}
                  >
                    <span className={cn(
                      "flex items-center gap-2",
                      categoria.isDefault && theme.colors.text.muted
                    )}>
                      {categoria.nombre}
                      {value === categoria._id && (
                        <Check className="h-4 w-4 ml-auto" />
                      )}
                    </span>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Footer para móvil */}
          <div className={cn(
            "md:hidden p-4 border-t",
            theme.colors.border.main,
            "bg-gray-50/50 dark:bg-gray-800/50"
          )}>
            <Button
              className="w-full"
              variant="secondary"
              onClick={() => updateState({ isOpen: false })}
            >
              Cerrar
            </Button>
          </div>
        </div>
      )}

      {/* Dialog de edición */}
      <Dialog 
        open={!!state.editingCategory} 
        onOpenChange={() => updateState({ editingCategory: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar categoría</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              value={state.editValue}
              onChange={(e) => updateState({ editValue: e.target.value })}
              placeholder="Nombre de la categoría"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => updateState({ editingCategory: null })}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                const categoria = categories.find(c => c._id === state.editingCategory);
                if (categoria) handleEdit(categoria);
              }}
            >
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación para eliminar */}
      <AlertDialog 
        open={!!state.deletingCategory} 
        onOpenChange={() => updateState({ deletingCategory: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar categoría?</AlertDialogTitle>
            <AlertDialogDescription>
              Las transacciones asociadas se moverán a la categoría 
              {type === 'ingreso' ? '"✨ Otros Ingresos"' : '"📝 Otros Gastos"'}. 
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={state.isLoadingAction}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => state.deletingCategory && handleDelete(state.deletingCategory)}
              disabled={state.isLoadingAction}
              className="bg-red-600 hover:bg-red-700"
            >
              {state.isLoadingAction ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}

export default CategorySelector;
