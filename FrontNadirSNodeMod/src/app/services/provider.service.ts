import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseApp } from 'app/models/response';
import { Provider } from 'app/models/provider';
import { Observable } from 'rxjs';
import { DefaultService } from './default.service';

@Injectable({
  providedIn: 'root',
})
export class ProviderService extends DefaultService {
  constructor(private http: HttpClient) {
    super('provider');
  }

  list(): Observable<ResponseApp<Provider[]>> {
    return this.http.get<ResponseApp<Provider[]>>(this.url);
  }

  findById(id: string): Observable<ResponseApp<Provider>> {
    return this.http.get<ResponseApp<Provider>>(`${this.url}/${id}`);
  }

  create(provider: Provider): Observable<ResponseApp<Provider>> {
    return this.http.post<ResponseApp<Provider>>(this.url, provider);
  }

  edit(provider: Provider): Observable<ResponseApp<Provider>> {
    return this.http.put<ResponseApp<Provider>>(`${this.url}/${provider._id}`, provider);
  }

  delete(id: String): Observable<ResponseApp<Provider>> {
    return this.http.delete<ResponseApp<Provider>>(`${this.url}/${id}`);
  }
}
