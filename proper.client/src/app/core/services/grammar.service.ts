import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'any',
})
export class GrammarService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  checkGrammar(text: string): Observable<any> {
    const body = { text }; // Wrap the plain text in an object
    return this.http.post(this.apiUrl, body, { headers: { 'Content-Type': 'application/json' } });
  }
}
