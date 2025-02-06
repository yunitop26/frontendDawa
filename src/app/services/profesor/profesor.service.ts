import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Person } from '../../model/Person';

@Injectable({
  providedIn: 'root'
})
export class ProfesorService {

  private apiUrl: string="http://localhost:8062/api/v1/system/get-teacher"
  
    constructor(private http:HttpClient) { 
  
    }
  
    getTeacher (): Observable <Person[]>{
  
      return this.http.get<Person[]>(this.apiUrl)
  
    }
}
