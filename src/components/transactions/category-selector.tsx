import React, { useState, useEffect, useRef, useMemo } from "react";
import { Check, ChevronDown, Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { categoriasApi } from '@/lib/api';
import type { Categoria } from "@/types/categoria";
import { cn } from "@/lib/utils";
import { theme } from "@/lib/theme";


type TransactionType = "ingreso" | "egreso";

interface CategorySelectorProps {
  type: TransactionType;
  value: string;
  onChange: (value: string) => void;
}

interface CategoriesGroup {
  custom: Categoria[];
  default: Categoria[];
}

export function CategorySelector({ type, value, onChange }: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Agrupar categorías por tipo (personalizadas y por defecto)
  const groupedCategories = useMemo((): CategoriesGroup => {
    return categories.reduce(
      (acc, cat) => {
        if (cat.isDefault) {
          acc.default.push(cat);
        } else {
          acc.custom.push(cat);
        }
        return acc;
      },
      { custom: [] as Categoria[], default: [] as Categoria[] }
    );
  }, [categories]);

  const selectedCategory = categories.find(cat => cat._id === value);

  // Cargar categorías
  useEffect(() => {
    const loadCategories = async () => {
      setIsLoading(true);
      try {
        const data = await categoriasApi.fetchCategorias();
        setCategories(data.filter((cat: Categoria) => cat.tipo === type));
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Error al cargar categorías",
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadCategories();
  }, [type, toast]);

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Manejar la creación de categorías
  const handleCreate = async () => {
    if (!newCategoryName.trim()) return;

    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  // Manejar la eliminación de categorías
  const handleDelete = async (categoria: Categoria) => {
    try {
      await categoriasApi.eliminarCategoria(categoria._id);
      
      setCategories(prev => prev.filter(cat => cat._id !== categoria._id));
      if (value === categoria._id) onChange("");
      
      toast({
        title: "Éxito",
        description: `Categoría "${categoria.nombre}" eliminada.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Error al eliminar categoría",
      });
    }
  };

  // Manejar la edición de categorías
  const handleEdit = async (categoria: Categoria) => {
    if (!editValue.trim() || editValue === categoria.nombre) {
      setEditingCategory(null);
      return;
    }

    try {
      const updatedCategoria = await categoriasApi.actualizarCategoria(
        categoria._id,
        { nombre: editValue.trim() }
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
      setEditingCategory(null);
    }
  };


  return (
    <div className="relative w-full" ref={containerRef}>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={isOpen}
        className={cn(
          "w-full justify-between",
          theme.colors.background.main,
          theme.colors.border.main,
          theme.colors.text.primary,
          "hover:bg-gray-50 dark:hover:bg-gray-800",
          selectedCategory?.isDefault && theme.colors.text.muted
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center gap-2">
          {selectedCategory ? (
            <>
              {selectedCategory.nombre}
            </>
          ) : (
            "Seleccionar categoría..."
          )}
        </span>
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {isOpen && (
        <div className={cn(
          "absolute mt-2 w-full rounded-md border shadow-lg z-50",
          "bg-white dark:bg-gray-900",
          "backdrop-blur-lg bg-opacity-95 dark:bg-opacity-95",
          "shadow-lg dark:shadow-gray-900/20",
          theme.colors.border.main
        )}>
          {/* Barra de búsqueda/creación */}
          <div className={cn("p-2 border-b", theme.colors.border.main)}>
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Nueva categoría..."
                className={cn(
                  "flex-1",
                  theme.colors.background.subtle,
                  theme.colors.border.subtle
                )}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newCategoryName.trim()) {
                    handleCreate();
                  }
                }}
              />
              <Button
                size="icon"
                onClick={handleCreate}
                disabled={!newCategoryName.trim() || isLoading}
                className={cn(
                  "shrink-0",
                  theme.effects.gradient.primary,
                  "text-white"
                )}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="max-h-[300px] overflow-y-auto py-1">
            {/* Categorías personalizadas */}
            {groupedCategories.custom.length > 0 && (
              <div>
                <div className={cn(
                  "px-3 py-1.5 text-xs font-medium uppercase tracking-wider",
                  theme.colors.text.muted
                )}>
                  Mis Categorías
                </div>
                {groupedCategories.custom.map(categoria => (
                  <CategoryItem
                    value={value}
                    key={categoria._id}
                    categoria={categoria}
                    isEditing={editingCategory === categoria._id}
                    editValue={editValue}
                    onSelect={() => {
                      onChange(categoria._id);
                      setIsOpen(false);
                    }}
                    onEdit={() => {
                      setEditingCategory(categoria._id);
                      setEditValue(categoria.nombre);
                    }}
                    onDelete={() => handleDelete(categoria)}
                    onEditSubmit={() => handleEdit(categoria)}
                    onEditCancel={() => setEditingCategory(null)}
                    onEditChange={(value) => setEditValue(value)}
                  />
                ))}
              </div>
            )}


            {/* Separador */}
            {groupedCategories.custom.length > 0 && groupedCategories.default.length > 0 && (
              <div className={cn("my-2 border-t", theme.colors.border.main)} />
            )}

            {/* Categorías por defecto */}
            {groupedCategories.default.length > 0 && (
              <div>
                <div className={cn(
                  "px-3 py-1.5 text-xs font-medium uppercase tracking-wider",
                  theme.colors.text.muted
                )}>
                  Categorías Predefinidas
                </div>
                {groupedCategories.default.map(categoria => (
                  <div
                    key={categoria._id}
                    className={cn(
                      "group flex items-center px-3 py-2 cursor-pointer",
                      theme.colors.background.hover,
                      value === categoria._id && theme.colors.background.subtle
                    )}
                    onClick={() => {
                      onChange(categoria._id);
                      setIsOpen(false);
                    }}
                  >
                    <div className={cn(
                      "flex items-center gap-2",
                      theme.colors.text.muted
                    )}>
                      {categoria.nombre}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Componente para cada ítem de categoría personalizada
interface CategoryItemProps {
  value: string;
  categoria: Categoria;
  isEditing: boolean;
  editValue: string;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onEditSubmit: () => void;
  onEditCancel: () => void;
  onEditChange: (value: string) => void;
}

function CategoryItem({
  value,
  categoria,
  isEditing,
  editValue,
  onSelect,
  onEdit,
  onDelete,
  onEditSubmit,
  onEditCancel,
  onEditChange,
}: CategoryItemProps) {
  return (
    <div 
      className={cn(
        "group flex items-center px-3 py-2 cursor-pointer",
        theme.colors.background.hover,
        value === categoria._id && theme.colors.background.subtle
      )}
      // className="group flex items-center justify-between px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
    
    
    >
      {isEditing ? (
        <div className="flex items-center gap-2 w-full">
          <Input
            value={editValue}
            onChange={(e) => onEditChange(e.target.value)}
            className="flex-1 h-8 dark:bg-gray-600 dark:border-gray-500"
            autoFocus
          />
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={onEditSubmit}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={onEditCancel}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <>
          <div
            className="flex items-center gap-2 flex-1 cursor-pointer text-gray-500 dark:text-gray-40"
            onClick={onSelect}
          >
            {categoria.nombre}
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 hover:bg-gray-300 dark:hover:bg-gray-800"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <Pencil className="h-4 w-4 text-gray-900 dark:text-white" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 hover:bg-gray-300 dark:hover:bg-gray-800"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-4 w-4 text-red-400" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default CategorySelector;
