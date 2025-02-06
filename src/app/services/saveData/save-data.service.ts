import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Dato } from '../../model/Dato';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaveDataService {

   private apiUrl: string="http://localhost:8062/api/v1/system/save"
  
    constructor(private http:HttpClient) { 
  
    }
  agregarDatos(dato: Dato):Observable<Dato>{
    return this.http.post<Dato>(this.apiUrl,dato)
  }
}
