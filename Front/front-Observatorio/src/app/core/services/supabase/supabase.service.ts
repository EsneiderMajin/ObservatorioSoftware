import { Injectable, NgZone } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient | undefined;
  // Datos de conexión (URL y Key) proporcionados
  private readonly SUPABASE_URL = 'https://zjotiniglbrqlepcdynr.supabase.co';
  private readonly SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpqb3RpbmlnbGJycWxlcGNkeW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxNzIyOTEsImV4cCI6MjA1ODc0ODI5MX0.fz1sa7aWk-jmBqyX-9akDO8WSDmogLmhcOzlRE7LK_0';

  constructor(private ngZone: NgZone) {
    this.ngZone.runOutsideAngular(() => {
      this.supabase = createClient(this.SUPABASE_URL, this.SUPABASE_KEY);
    });
  }

  getClient(): SupabaseClient {
    if (!this.supabase) {
      throw new Error('Supabase client is not initialized.');
    }
    return this.supabase;
  }
}