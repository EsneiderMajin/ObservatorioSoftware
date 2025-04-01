import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/core/services/supabase/supabase.service';

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.css']
})
export class AuthCallbackComponent implements OnInit {

  constructor(
    private router: Router,
    private supabaseService: SupabaseService
  ) {}

  ngOnInit(): void {
    // Extraer tokens del fragmento
    // Ejemplo de URL: #access_token=ey...&expires_at=...
    const hash = window.location.hash.substring(1); // quitar '#'
    const params = new URLSearchParams(hash);

    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const tokenType = params.get('token_type');
    const expiresIn = params.get('expires_in');
    const type = params.get('type'); // Por ejemplo 'signup' si es verificación de nuevo usuario

    if (accessToken) {
      // Guardar tokens en localStorage o usar supabase.auth.setSession(...)
      localStorage.setItem('access_token', accessToken);
      if (refreshToken) localStorage.setItem('refresh_token', refreshToken);

      // Ejemplo: si usas un servicio que maneja la sesión:
      // this.supabaseService.getClient().auth.setSession({
      //   access_token: accessToken,
      //   refresh_token: refreshToken
      // });

      // Redirigir a una página de confirmación o dashboard
      this.router.navigate(['/inicio']);
    } else {
      console.error('No se encontró access_token en la URL');
      // Redirigir a una página de error o login
      this.router.navigate(['/login']);
    }
  }
}