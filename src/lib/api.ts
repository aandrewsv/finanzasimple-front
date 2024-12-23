// src/lib/api.ts
const BASE_URL = process.env.BACK_URL;

// Utilidad para obtener el token
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Al parecer, hay un problema la autenticación');
  return { 'Authorization': `Bearer ${token}` };
};

// Utilidad para manejar errores
const handleApiError = (error: unknown) => {
  if (error instanceof Error) {
    throw error;
  }
  throw new Error('Error desconocido en la API');
};

// Interfaces Categorías
export interface Categoria {
  _id: string;
  nombre: string;
  tipo: 'ingreso' | 'egreso';
  orden: number;
  isVisible: boolean;
  usuario: string;
}

export interface CreateCategoriaDTO {
  nombre: string;
  tipo: 'ingreso' | 'egreso';
  orden?: number;
  isVisible?: boolean;
}

export interface UpdateCategoriaDTO {
  nombre?: string;
  orden?: number;
  isVisible?: boolean;
}

// API de Categorías
export const categoriasApi = {
  // Obtener todas las categorías del usuario
  fetchCategorias: async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/categorias`, {
        headers: {
          ...getAuthHeader(),
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener categorías');
      }
      
      return response.json();
    } catch (error) {
      handleApiError(error);
    }
  },

  // Crear una nueva categoría
  crearCategoria: async (categoria: CreateCategoriaDTO) => {
    try {
      const response = await fetch(`${BASE_URL}/api/categorias`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoria),
      });

      if (!response.ok) {
        throw new Error('Error al crear categoría');
      }

      return response.json();
    } catch (error) {
      handleApiError(error);
    }
  },

  // Actualizar una categoría existente
  actualizarCategoria: async (id: string, updates: UpdateCategoriaDTO) => {
    try {
      const response = await fetch(`${BASE_URL}/api/categorias/${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar categoría');
      }

      return response.json();
    } catch (error) {
      handleApiError(error);
    }
  },

  // Eliminar una categoría
  eliminarCategoria: async (id: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/categorias/${id}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar categoría');
      }

      return true;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Obtener una categoría específica por ID
  obtenerCategoria: async (id: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/categorias/${id}`, {
        headers: {
          ...getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener la categoría');
      }

      return response.json();
    } catch (error) {
      handleApiError(error);
    }
  },

  // Actualizar visibilidad de una categoría
  actualizarVisibilidad: async (id: string, isVisible: boolean) => {
    try {
        const response = await fetch(`${BASE_URL}/api/categorias/${id}/visibility`, {
            method: 'PATCH',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ isVisible }),
        });

        if (!response.ok) {
            throw new Error('Error al actualizar la visibilidad de la categoría');
        }

        return response.json();
    } catch (error) {
        handleApiError(error);
    }
  },

};

// Re-exportamos las funciones individuales para mantener compatibilidad
export const {
  fetchCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
  obtenerCategoria,
  actualizarVisibilidad
} = categoriasApi;


// Interfaces para Transacciones
export interface Transaccion {
  _id: string;
  fecha: string;
  monto: number;
  descripcion: string;
  tipo: 'ingreso' | 'egreso';
  categoria: Categoria; // Ahora es el objeto completo en lugar de solo el ID
  usuario: string;
}

export interface TransaccionesFilters {
  startDate?: string;
  endDate?: string;
  tipo?: 'ingreso' | 'egreso';
}

export interface CreateTransaccionDTO {
  monto: number;
  descripcion: string;
  tipo: 'ingreso' | 'egreso';
  categoria: string;
  fecha: string;
}

// API de Transacciones
export const transaccionesApi = {
  // Método existente
  crearTransaccion: async (transaccion: CreateTransaccionDTO) => {
    try {
      const response = await fetch(`${BASE_URL}/api/transacciones`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaccion),
      });

      if (!response.ok) {
        throw new Error('Error al crear la transacción');
      }

      return response.json();
    } catch (error) {
      handleApiError(error);
    }
  },

  // Nuevo método para obtener transacciones con filtros
  fetchTransacciones: async (filters?: TransaccionesFilters) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters?.startDate) queryParams.append('startDate', filters.startDate);
      if (filters?.endDate) queryParams.append('endDate', filters.endDate);
      if (filters?.tipo) queryParams.append('tipo', filters.tipo);

      const url = `${BASE_URL}/api/transacciones${
        queryParams.toString() ? `?${queryParams.toString()}` : ''
      }`;

      const response = await fetch(url, {
        headers: {
          ...getAuthHeader(),
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || 'Error al obtener las transacciones');
      }

      return response.json();
    } catch (error) {
      handleApiError(error);
    }
  },

  // Obtener una transacción específica
  fetchTransaccion: async (id: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/transacciones/${id}`, {
        headers: {
          ...getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener la transacción');
      }

      return response.json();
    } catch (error) {
      handleApiError(error);
    }
  },

  // Actualizar una transacción
  actualizarTransaccion: async (id: string, updates: Partial<CreateTransaccionDTO>) => {
    try {
      const response = await fetch(`${BASE_URL}/api/transacciones/${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la transacción');
      }

      return response.json();
    } catch (error) {
      handleApiError(error);
    }
  },

  // Eliminar una transacción
  eliminarTransaccion: async (id: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/transacciones/${id}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la transacción');
      }

      return true;
    } catch (error) {
      handleApiError(error);
    }
  },
};

// Re-exportar funciones individuales
export const {
  crearTransaccion,
  fetchTransacciones,
  fetchTransaccion,
  actualizarTransaccion,
  eliminarTransaccion,
} = transaccionesApi;
