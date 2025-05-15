import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';
import { ErrorService } from '../../services/error.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnInit {
  taskForm!: FormGroup;
  isEditMode = false;
  taskId: string | null = null;
  submitButtonText = 'Crear Tarea';
  isLoading = false;
  isSubmitting = false;

  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private errorService = inject(ErrorService);

  ngOnInit(): void {
    this.initForm();
    
    // Verificar si estamos en modo edición
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.taskId = id;
      this.submitButtonText = 'Actualizar Tarea';
      this.loadTaskData(id);
    }
  }

  // Validador personalizado para fecha límite en el futuro
  pastDateValidator(control: AbstractControl): ValidationErrors | null {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Resetear hora para comparar solo fechas

    if (selectedDate < today) {
      return { pastDate: true };
    }
    return null;
  }

  initForm(): void {
    this.taskForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', Validators.required],
      materia: ['', Validators.required],
      fecha_limite: ['', [Validators.required, this.pastDateValidator]],
      estado: ['pendiente', Validators.required]
    });
  }

  loadTaskData(id: string): void {
    this.isLoading = true;
    this.taskService.getTaskById(id).subscribe({
      next: (task) => {
        if (task) {
          // Formatear la fecha para el campo de tipo date
          const fechaLimite = new Date(task.fecha_limite);
          const formattedDate = fechaLimite.toISOString().split('T')[0];
          
          this.taskForm.patchValue({
            titulo: task.titulo,
            descripcion: task.descripcion,
            materia: task.materia,
            fecha_limite: formattedDate,
            estado: task.estado
          });
        } else {
          this.errorService.setError('No se encontró la tarea');
          this.router.navigate(['/tasks']);
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorService.setError('Error al cargar la tarea: ' + error.message);
        this.router.navigate(['/tasks']);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.markFormGroupTouched(this.taskForm);
      return;
    }

    this.isSubmitting = true;

    const taskData = {
      titulo: this.taskForm.value.titulo,
      descripcion: this.taskForm.value.descripcion,
      materia: this.taskForm.value.materia,
      fecha_limite: new Date(this.taskForm.value.fecha_limite),
      estado: this.taskForm.value.estado
    };

    if (this.isEditMode && this.taskId) {
      // Actualizar tarea existente
      const updatedTask: Task = {
        _id: this.taskId,
        ...taskData
      };
      
      this.taskService.updateTask(updatedTask).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
          this.isSubmitting = false;
        },
        error: (error) => {
          this.errorService.setError('Error al actualizar la tarea: ' + error.message);
          this.isSubmitting = false;
        }
      });
    } else {
      // Crear nueva tarea
      this.taskService.addTask(taskData).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
          this.isSubmitting = false;
        },
        error: (error) => {
          this.errorService.setError('Error al crear la tarea: ' + error.message);
          this.isSubmitting = false;
        }
      });
    }
  }

  // Utilidad para marcar todos los campos como touched
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/tasks']);
  }
}
