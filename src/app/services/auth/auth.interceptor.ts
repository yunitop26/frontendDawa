import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';



@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    if (!token) {
      // Si no hay token, continúa con la solicitud sin modificarla
      return next.handle(req);
    }

    // Verificar si el token está próximo a expirar
    if (this.authService.isTokenExpiringSoon()) {
      // Si el token está próximo a expirar, intenta renovarlo
      return from(this.authService.refreshToken()).pipe(
          switchMap(newToken => {
            // Clonar la solicitud con el nuevo token y continuar
            const clonedRequest = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`,
              },
            });
            return next.handle(clonedRequest);
          }),
          catchError((error: HttpErrorResponse) => {
            // En caso de error de renovación, maneja el error (redirigir al login, por ejemplo)
            if (error.status === 403 || error.status === 401) {
                console.error('Session expired. Redirecting to login...');
              this.authService.logout();

            }
            return throwError(error);
          })
      );
    }

    // Si el token es válido, añadirlo al encabezado `Authorization` y continuar
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('tockend',clonedRequest);
      if (token) {
          console.log('Token agregado al encabezado:', token);
      }
    return next.handle(clonedRequest).pipe(
        catchError((error: HttpErrorResponse) => {
          // Manejar error 401 (No autorizado)
          if (error.status === 403 || error.status === 401) {
            this.authService.logout();
            console.error('Session expired. Redirecting to login...');
          }
          return throwError(error);
        })
    );
  }
}