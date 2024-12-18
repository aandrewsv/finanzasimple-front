export interface Categoria {
    _id: string;
    nombre: string;
    tipo: 'ingreso' | 'egreso';
    isDefault?: boolean;
    orden?: number;
  }