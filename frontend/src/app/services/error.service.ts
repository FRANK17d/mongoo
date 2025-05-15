import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private errorMessageSource = new Subject<string>();
  errorMessage$ = this.errorMessageSource.asObservable();

  /**
   * Emite un mensaje de error para ser mostrado en la UI
   */
  setError(message: string): void {
    this.errorMessageSource.next(message);
  }
}