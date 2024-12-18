const BASE_URL = process.env.BACK_URL;

// Utilidad para obtener el token
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No hay token');
  return { 'Authorization': `Bearer ${token}` };
};

// Utilidad para manejar errores
const handleApiError = (error: unknown) => {
  if (error instanceof Error) {
    throw error;
  }
  throw new Error('Error desconocido en la API');
};

// Interfaces Transacciones
export interface CreateTransaccionDTO {
  monto: number;
  descripcion: string;
  tipo: 'ingreso' | 'egreso';
  categoria: string;
}

// API de Transacciones
export const transaccionesApi = {
  // Crear una nueva transacción
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
};

// Interfaces Categorías
export interface CreateCategoriaDTO {
  nombre: string;
  tipo: 'ingreso' | 'egreso';
  orden?: number;
}

export interface UpdateCategoriaDTO {
  nombre: string;
  orden?: number;
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
};

// Re-exportamos las funciones individuales para mantener compatibilidad
export const {
  fetchCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
  obtenerCategoria,
} = categoriasApi;
