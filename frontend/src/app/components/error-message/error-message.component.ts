import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ErrorService } from '../../services/error.service';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (errorMessage) {
      <div class="error-container">
        <div class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          <span>{{ errorMessage }}</span>
          <button class="close-btn" (click)="clearError()">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    }
  `
})
export class ErrorMessageComponent implements OnInit, OnDestroy {
  errorMessage: string | null = null;
  private subscription: Subscription = new Subscription();

  constructor(private errorService: ErrorService) {}

  ngOnInit(): void {
    this.subscription = this.errorService.errorMessage$.subscribe(message => {
      this.errorMessage = message;
      
      // Autolimpiar después de 5 segundos
      if (message) {
        setTimeout(() => {
          this.clearError();
        }, 5000);
      }
    });
  }

  clearError(): void {
    this.errorMessage = null;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
