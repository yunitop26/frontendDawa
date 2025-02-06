import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Select } from 'primeng/select';
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";
import {ButtonModule} from "primeng/button";
import { FileUpload } from 'primeng/fileupload';
import {UploadFileComponent}from '../../shared/component/upload-file/upload-file.component'
import {InputNumber} from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { EstudianteService } from '../../services/estudiante/estudiante.service';
import { Person}from '../../model/Person'
import { ProfesorService } from '../../services/profesor/profesor.service';
import { SaveDataService } from '../../services/saveData/save-data.service';
import { Dato } from '../../model/Dato';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-secretary',
  imports: [
    ReactiveFormsModule,
    Select,
    ToastModule,
    ButtonModule,
    FileUpload,
    UploadFileComponent,
    InputNumber,
    TextareaModule
  ],
  templateUrl: './secretary.component.html',
  styleUrl: './secretary.component.css',
  providers: [MessageService]
})
export class SecretaryComponent implements OnInit {
  form!: FormGroup
  profesores!: any
  estudiantes!: any

  constructor (private fb:FormBuilder,private messageService: MessageService, private estudianteService: EstudianteService, private profesorService: ProfesorService, private datoService: SaveDataService){}

  ngOnInit(): void {
    this.formInit();
    this.obtenerEstudiante();
    this.obtenerProfesor();
  } 

  obtenerEstudiante(){
    this.estudianteService.getStudents().subscribe((data:Person[])=>{
      this.estudiantes=data
      console.log(this.estudiantes)
    })
  }

  obtenerProfesor(){
    this.profesorService.getTeacher().subscribe((data:Person[])=>{
      this.profesores=data
      console.log(this.profesores)
    })
  }

  formInit() {
    this.form=this.fb.group({
      profesor: ['',[Validators.required]],
      estudiante:['',[Validators.required]],
      documentIn:['',[Validators.required]],
      text:['',[Validators.required]],
      value:['',[Validators.required]],
    })
  }

  onUpload(event: UploadEvent) {
    const file = event.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const base64String = reader.result?.toString().split(',')[1] ?? ''; // Extraer solo la parte base64

        this.form.patchValue({
            documentIn: {
                name: file.name,
                base64: base64String,
                type: file.type
            }
        });

        console.log("Archivo cargado correctamente:", this.form.value.documentIn);
    };

    reader.onerror = (error) => {
        console.error("Error al leer el archivo:", error);
    };

    this.messageService.add({ severity: 'info', summary: 'Éxito', detail: 'Archivo cargado correctamente' });
}




onSubmit(){
  if(this.form.invalid){
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Formulario Invalido' });
    return;
  }

  const newDato: Dato = {
      student: this.form.value.estudiante,
      teacher: this.form.value.profesor,
      document: this.form.value.documentIn,  // Asegurar que documentIn se asigne correctamente
      documentName: this.form.value.documentIn?.name ?? '',  // Evitar valores nulos
      note: this.form.value.value,
      observation: this.form.value.text
  };

  console.log("Datos enviados:", newDato); // Depuración

  this.datoService.agregarDatos(newDato).subscribe({
      next: (agregarDato) => {
          alert("Se ha creado la alerta");
          this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'Creado correctamente' });
      },
      error: (error) => {
          console.error("Error al enviar:", error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo enviar la información' });
      }
  });
}

  clearForm(){
    this.form.reset({
      profesor:"",
      estudiante:"",
      value:"",
      text:"",
      documentIn:"",
    })
  }


}
