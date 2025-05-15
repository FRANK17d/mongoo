import { Component, OnInit, inject } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ErrorService } from '../../services/error.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  filterStatus: string = 'all';
  isLoading: boolean = true;

  private taskService = inject(TaskService);
  private errorService = inject(ErrorService);

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading = true;
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.applyFilter();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorService.setError('Error al cargar las tareas: ' + error.message);
        this.isLoading = false;
      }
    });
  }

  deleteTask(id: string | undefined): void {
    // Verificar que el ID existe antes de intentar eliminar
    if (!id) {
      this.errorService.setError('Error: ID de tarea no válido');
      return;
    }

    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      this.taskService.deleteTask(id).subscribe({
        next: (success) => {
          if (success) {
            this.loadTasks();
          }
        },
        error: (error) => {
          this.errorService.setError('Error al eliminar la tarea: ' + error.message);
        }
      });
    }
  }

  toggleCompleted(task: Task): void {
    // Verificar que la tarea tiene un ID válido
    if (!task._id) {
      this.errorService.setError('Error: No se puede actualizar la tarea sin ID');
      return;
    }

    const nuevoEstado = task.estado === 'completado' ? 'pendiente' : 'completado';
    const updatedTask: Task = { ...task, estado: nuevoEstado };
    
    this.taskService.updateTask(updatedTask).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (error) => {
        this.errorService.setError('Error al actualizar la tarea: ' + error.message);
      }
    });
  }

  applyFilter(): void {
    if (this.filterStatus === 'all') {
      this.filteredTasks = [...this.tasks];
    } else {
      this.filteredTasks = this.tasks.filter(task => task.estado === this.filterStatus);
    }
  }
}
