import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Person } from '../../model/Person';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {

  private apiUrl: string="http://localhost:8062/api/v1/system/get-students"

  constructor(private http:HttpClient) { 

  }

  getStudents (): Observable <Person[]>{

    return this.http.get<Person[]>(this.apiUrl)

  }

}
