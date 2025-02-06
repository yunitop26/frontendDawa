import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { BackendService } from '../../services/backend/backend.service';

@Component({
  selector: 'app-view-data-guess',
  imports: [
    TableModule,
    CommonModule,
  
  ],
  templateUrl: './view-data-guess.component.html',
  styleUrl: './view-data-guess.component.css'
})
export class ViewDataGuessComponent implements OnInit {
  products!: any[];

    constructor(private backendService: BackendService) {}

    ngOnInit() {
        this.backendService.getSavedData().subscribe({
            next: (data) => {
                // Procesamos los datos recibidos
                this.products = data.map((item) => ({
                    id: item.id,
                    studentName: item.student.name,
                    teacherName: item.teacher.name,
                    documentName: item.documentName,
                    note: item.note,
                    observation: item.observation,
                }));
                console.log('Datos procesados:', this.products); // Verifica en la consola que los datos se carguen correctamente
            },
            error: (err) => {
                console.error('Error al obtener los datos', err);
            },
        });
    }


}
