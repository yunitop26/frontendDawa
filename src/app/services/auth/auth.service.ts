import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {catchError, map, Observable} from "rxjs";

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  userId?: number;
  username: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginUrl = 'http://localhost:8062/auth/login';
  private refreshTokenUrl = 'http://localhost:8062/auth/refresh-token'; // Endpoint para renovar el token

  constructor(private http: HttpClient, private router: Router) {
  }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, loginRequest)
        .pipe(
            map(response => {
              // Almacena el token en localStorage para autenticar futuras solicitudes
              console.log("Respuesta del servidor:", response);

      if (!response || !response.token || !response.username) {
        throw new Error("La respuesta del servidor es inválida");
      }

      this.setToken(response.token);
      localStorage.setItem('username', response.username);
      
      // Verifica si 'userId' existe antes de almacenarlo
      if (response.userId !== undefined && response.userId !== null) {
        localStorage.setItem('userId', response.userId.toString());
      }
              return response;
            }),
            catchError(error => {
              console.error("error en el login", error);
              // Maneja errores
              throw error;
            })
        );
  }

  logout(): void {
    console.log('Logging out');
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    sessionStorage.clear();
    localStorage.removeItem('userId');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  // Método para almacenar el token en el navegador
  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Método para obtener el token almacenado
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Verificar si el token está próximo a expirar (faltan menos de 5 minutos)
  isTokenExpiringSoon(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const expiresInMs = 1 * 60 * 60 * 1000 + 50 * 60 * 1000; // 1 hora y 50 minutos en milisegundos
      return expiresInMs < 5 * 60 * 1000; // Retorna true si faltan menos de 5 minutos
    } catch (error) {
      console.error("Error decoding token:", error);
      return true; // Si hay error al decodificar, asumimos que el token está expirado
    }
  }

  // Renovar el token mediante el endpoint /refresh-token
  refreshToken(): Observable<string> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No token found');
    }

    const headers = new HttpHeaders({Authorization: `Bearer ${token}`});
    return this.http.post<{ token: string }>(this.refreshTokenUrl, null, {headers})
        .pipe(
            map(response => {
              const newToken = response.token;
              this.setToken(newToken); // Actualiza el token en localStorage
              return newToken;
            }),
            catchError(error => {
              console.error("Error refreshing token:", error);
              this.logout();
              throw error;
            })
        );
  }

}
