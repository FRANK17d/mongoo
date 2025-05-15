import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { isPlatformServer } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';

/**
 * Interceptor para manejar las URLs base diferentes en el cliente y el servidor
 * Este interceptor es crucial para el correcto funcionamiento de SSR
 */
export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const isServer = isPlatformServer(platformId);
  
  // Si estamos en el servidor, necesitamos usar URLs absolutas
  if (isServer) {
    // En el servidor, modificamos la URL para usar una URL absoluta
    const serverUrl = environment.backendUrl;

    // Solo modificamos las URLs que apuntan a nuestra API
    if (req.url.startsWith('/api/tareas') || req.url.includes(environment.apiUrl)) {
      const apiUrl = req.url.replace(environment.apiUrl, '');
      const fullUrl = `${serverUrl}/api/tareas${apiUrl}`;
      return next(req.clone({ url: fullUrl }));
    }
  }

  return next(req);
};