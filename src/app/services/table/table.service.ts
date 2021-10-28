import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = `http://localhost:8090`;

@Injectable({
  providedIn: 'root'
})
export class TableService {

  constructor(private http: HttpClient) { }

  getCustomerPhones(params: any): Observable<any> {
    return this.http.get(`${baseUrl}/customer/allPhones`, { params });
  }

}
