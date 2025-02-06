import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {DecimalPipe, NgForOf, NgIf} from "@angular/common";
import {DocumentIn}from "../../../model/Document.model"



@Component({
  selector: 'ui-file-uploader',
  imports: [
    DecimalPipe,
    NgIf,
    NgForOf
  ],

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UploadFileComponent),
      multi: true,
    },
  ],

  templateUrl: './upload-file.component.html',
  styleUrl: './upload-file.component.css'
})
export class UploadFileComponent implements ControlValueAccessor {
  @Input() required = false; // Define si el campo es requerido
  @Input() multiple = false; // Define si permite múltiples archivos
  @Input() view: 'single' | 'multiple' = 'single'; // Define la vista (por defecto: single)
  @Input() label: string = ''; // Texto del label

  files: File[] = []; // Lista de archivos seleccionados
  progress: { [key: string]: number } = {}; // Mapa para el progreso de cada archivo
  uploadInProgress = false; // Estado de subida

  // Implementación de ControlValueAccessor
  onChange = (documents: DocumentIn[]) => {};
  onTouched = () => {};

  /** Manejar entrada de archivos desde el input */
  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const fileList = input.files;

    if (fileList) {
      const filesArray = this.removeDuplicateFiles([...this.files, ...Array.from(fileList)]);

      // Si `multiple` es true, concatena los nuevos archivos con los existentes, evitando duplicados.
      const uniqueFiles = this.multiple
          ? [...this.files, ...filesArray].filter((file, index, array) => array.findIndex(f => f.name === file.name) === index)
          : filesArray; // De lo contrario, usa únicamente el archivo nuevo.

      this.files = uniqueFiles;

      // Convertir los archivos a objetos DocumentIn[]
      Promise.all(
          this.files.map(file => this.convertToDocument(file))
      ).then(documents => {
        this.onChange(documents); // Notificar al formulario reactivo.
      });
    }
  }

  /** Convertir un archivo a un objeto DocumentIn */
  private convertToDocument(file: File): Promise<DocumentIn> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Content = (reader.result as string).split(',')[1]; // Eliminamos el encabezado del base64
        const document: DocumentIn = {
          name: file.name,
          base64: base64Content,
          type: file.type || 'application/octet-stream', // Tipo del archivo
        };
        resolve(document);
      };
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file); // Leer archivo como base64
    });
  }

  /** Eliminar archivo */
  removeFile(index: number): void {
    const file = this.files[index];
    delete this.progress[file.name]; // Elimina el progreso del archivo
    this.files.splice(index, 1); // Remueve el archivo de la lista

    // Convertir los archivos restantes a DocumentIn[]
    Promise.all(
        this.files.map(file => this.convertToDocument(file))
    ).then(documentArray => {
      this.onChange(documentArray); // Notificar los cambios al formulario
    });
  }

  /** Simular subida de archivos */
  startUploadSimulation(): void {
    this.uploadInProgress = true;

    this.files.forEach((file, index) => {
      const fileName = file.name || `Archivo_${index}`; // Garantiza un índice válido
      this.progress[fileName] = 0; // Inicia el progreso en 0

      const interval = setInterval(() => {
        if (this.progress[fileName] >= 100) {
          clearInterval(interval);
          if (index === this.files.length - 1) {
            // Finaliza cuando el último archivo termine
            this.uploadInProgress = false;
          }
        } else {
          this.progress[fileName] += Math.floor(Math.random() * 10) + 5; // Incremento de progreso aleatorio
        }
      }, 300); // Incrementa cada 300ms
    });
  }

  writeValue(documents: DocumentIn[]): void {
    if (documents) {
      this.files = []; // Resetear la lista de archivos
      // Simular archivos a partir del modelo DocumentIn si es necesario
    } else {
      this.files = [];
    }
  }

  registerOnChange(fn: (documents: DocumentIn[]) => void): void {
    this.onChange = fn; // Notificar cambios hacia el formulario
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  getProgressForFirstFile(): number {
    if (this.files.length > 0 && this.files[0]?.name) {
      return this.progress[this.files[0].name] || 0; // Retorna el progreso del primer archivo o 0
    }
    return 0; // Si no hay archivo, el progreso es 0
  }

  isValidProgressForFirstFile(): boolean {
    // Verifica que haya al menos un archivo y que su nombre sea válido
    if (this.files.length > 0 && this.files[0]?.name) {
      return this.progress[this.files[0].name] !== undefined;
    }
    return false;
  }

  /** Disparar el dialogo de selección de archivos */
  triggerFileInput(inputId: string): void {
    const inputElement = document.getElementById(inputId) as HTMLInputElement;
    console.log('el input es:', inputElement);
    if (inputElement) {
      inputElement.click(); // Simula el clic para abrir el diálogo de selección de archivos
    }
  }

  /** Manejar cuando el archivo se arrastra sobre la caja de carga */
  onDragOver(event: DragEvent): void {
    event.preventDefault(); // Prevenir el comportamiento por defecto
    event.stopPropagation();
  }

  /** Manejar cuando el archivo se sale del área de carga */
  onDragLeave(event: DragEvent): void {
    event.preventDefault(); // Prevenir el comportamiento por defecto
    event.stopPropagation();
  }

  /** Manejar cuando los archivos se sueltan en la caja de carga */
  onDrop(event: DragEvent): void {
    event.preventDefault(); // Prevenir el comportamiento por defecto
    event.stopPropagation();

    if (event.dataTransfer?.files) {
      const fileList = event.dataTransfer.files;
      const filesArray = this.removeDuplicateFiles([...this.files, ...Array.from(fileList)]);

      // Si `multiple` es true, combinar y evitar duplicados
      const uniqueFiles = this.multiple
          ? [...this.files, ...filesArray].filter((file, index, array) => array.findIndex(f => f.name === file.name) === index)
          : filesArray.slice(0, 1); // De lo contrario, solo el archivo actual.

      this.files = uniqueFiles;

      // Convertir los archivos a objetos DocumentIn[]
      Promise.all(
          this.files.map(file => this.convertToDocument(file))
      ).then(documents => {
        this.onChange(documents); // Notificar al formulario reactivo
      });
    }
  }

  private removeDuplicateFiles(files: File[]): File[] {
    return files.filter((file, index, array) => array.findIndex(f => f.name === file.name) === index);
  }

}
