import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private supabaseService: SupabaseService) {}



  login(email: string, password: string): Observable<boolean> {
    const supabase = this.supabaseService.getClient();
    return new Observable<boolean>(observer => {
      supabase.auth.signInWithPassword({ email, password })
        .then(({ data, error }) => {
          if (error) {
            console.error('Error al iniciar sesión:', error);
            observer.error(error);
          } else {
            localStorage.setItem('token', data.session.access_token);
            observer.next(true);
          }
          observer.complete();
        })
        .catch(error => {
          console.error('Error al iniciar sesión:', error);
          observer.error(error);
        });
    }).pipe(delay(100)); // Simula un retraso de 1 segundo
    

  }

  logout(): Observable<boolean> {
    const supabase = this.supabaseService.getClient();
    return new Observable<boolean>(observer => {
      supabase.auth.signOut()
        .then(({ error }) => {
          if (error) {
            console.error('Error al cerrar sesión:', error);
            observer.error(error);
          } else {
            localStorage.removeItem('token');
            observer.next(true);
          }
          observer.complete();
        })
        .catch(error => {
          console.error('Error al cerrar sesión:', error);
          observer.error(error);
        });
    }).pipe(delay(100)); // Simula un retraso de 1 segundo
  }
  
  consultarUsuarioPorToken(): Observable<any> {
    const supabase = this.supabaseService.getClient();
    return new Observable<any>(observer => {
      const token = localStorage.getItem('token');
      if (!token) {
        observer.error('No hay token disponible');
        return;
      }

      supabase.auth.getUser()
        .then(({ data, error }) => {
          if (error) {
            console.error('Error al obtener el usuario:', error);
            observer.error(error);
          } else {
            observer.next(data.user);
          }
          observer.complete();
        })
        .catch(error => {
          console.error('Error al obtener el usuario:', error);
          observer.error(error);
        });
    }).pipe(delay(100)); // Simula un retraso de 1 segundo
  }

}