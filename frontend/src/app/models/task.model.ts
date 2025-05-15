export interface Task {
  _id?: string;
  titulo: string;
  descripcion: string;
  fecha_limite: Date;
  materia: string;
  estado: 'pendiente' | 'completado';
  createdAt?: Date;
  updatedAt?: Date;
}