import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Task } from '../models/task.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  /**
   * Obtiene todas las tareas
   */
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene una tarea por su ID
   */
  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Añade una nueva tarea
   */
  addTask(task: Omit<Task, '_id' | 'createdAt' | 'updatedAt'>): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualiza una tarea existente
   */
  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${task._id}`, task, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Elimina una tarea
   */
  deleteTask(id: string): Observable<boolean> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, this.httpOptions).pipe(
      catchError(error => {
        this.handleError(error);
        return throwError(() => false);
      })
    );
  }

  /**
   * Maneja los errores de las peticiones HTTP
   */
  private handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}