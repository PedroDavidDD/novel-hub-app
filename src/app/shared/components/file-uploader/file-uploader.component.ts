import { Component, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription, take } from 'rxjs';

export interface FileItem {
  file: File;
  previewUrl?: string;
  progress: number;
  uploading: boolean;
  error?: boolean;
  uploaded: boolean;
}

@Component({
  selector: 'app-file-uploader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="drop-zone"
      (dragover)="onDragOver($event)" 
      (dragleave)="onDragLeave($event)"
      (drop)="onDrop($event)">
      <p>Arrastra archivos aquí o <button (click)="fileInput.click()">Explorar</button></p>
      <input #fileInput type="file" (change)="onFileSelected($event)" [multiple]="multiple" hidden>
    </div>

    <div class="file-list" *ngFor="let item of files; let i = index">
      <img *ngIf="item.previewUrl" [src]="item.previewUrl" class="thumb">
      
      <div class="info">
        <span>{{ item.file.name }}</span>
        <div class="progress-bar" *ngIf="item.uploading">
           <div [style.width.%]="item.progress"></div>
        </div>
      </div>

      <div class="actions">
        <button *ngIf="item.uploaded" (click)="viewFile(item)">👁️ Ver</button>
        
        <button (click)="removeFile(i)">🗑️</button>
      </div>
    </div>
  `,
  styles: [`
    .drop-zone { border: 2px dashed #ccc; padding: 20px; text-align: center; }
    .drop-zone.hover { border-color: blue; background: #f0f8ff; }
    .file-list { display: flex; align-items: center; margin-top: 10px; gap: 10px; }
    .progress-bar { height: 5px; background: #eee; width: 100%; margin-top: 5px; }
    .progress-bar div { height: 100%; background: green; transition: width 0.3s; }
  `]
})
export class FileUploaderComponent implements OnDestroy {
  @Input() multiple = false;
  @Input() validTypes: string[] = ['image/png', 'application/pdf'];
  @Input() maxSizeMB = 5;

  // Función opcional inyectada: Si se pasa, sube automáticamente
  @Input() uploadFn?: (file: File) => Observable<number>;
  @Input() deleteFn?: (file: File) => Observable<boolean>;

  private subscriptions: Subscription[] = [];

  @Output() filesChanged = new EventEmitter<FileItem[]>();
  @Output() onView = new EventEmitter<FileItem>();

  files: FileItem[] = [];
  isDragging = false;

  onDragOver(e: Event) { e.preventDefault(); e.stopPropagation(); this.isDragging = true; }
  onDragLeave(e: Event) { e.preventDefault(); e.stopPropagation(); this.isDragging = false; }
  
  onDrop(e: DragEvent) {
    e.preventDefault();
    this.isDragging = false;
    if (e.dataTransfer?.files) this.processFiles(e.dataTransfer.files);
  }

  onFileSelected(e: any) {
    if (e.target.files) this.processFiles(e.target.files);
  }

  private processFiles(fileList: FileList) {
    Array.from(fileList).forEach(file => {
      // 1. Validaciones
      if (!this.validTypes.includes(file.type)) return alert(`Tipo no válido: ${file.name}`);
      if (file.size > this.maxSizeMB * 1024 * 1024) return alert(`Muy pesado: ${file.name}`);

      const newItem: FileItem = { 
        file, 
        progress: 0, 
        uploading: false, 
        uploaded: false 
      };

      // 2. Generar Preview
      if (file.type.startsWith('image')) {
        const reader = new FileReader();
        reader.onload = (e: any) => newItem.previewUrl = e.target.result;
        reader.readAsDataURL(file);
      }

      this.files.push(newItem);
      
      // 3. Subida Automática (si existe uploadFn)
      if (this.uploadFn) {
        newItem.uploading = true;
        const sub = this.uploadFn(file).pipe(take(1)).subscribe({
          next: (progress) => newItem.progress = progress,
          complete: () => {
            newItem.uploading = false;
            newItem.uploaded = true;
            this.emitChange();
          },
          error: () => newItem.error = true
        });
        this.subscriptions.push(sub);
      } else {
        // Si es solo local
        newItem.uploaded = true; 
        this.emitChange();
      }
    });
  }

  removeFile(index: number) {
    const item = this.files[index];
    if (this.deleteFn && item.uploaded) {
      const sub = this.deleteFn(item.file).pipe(take(1)).subscribe(() => {
        this.files.splice(index,1);
        this.emitChange();
      });
      this.subscriptions.push(sub);
    } else {
      this.files.splice(index,1);
      this.emitChange();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  viewFile(item: FileItem) {
    // Aquí puedes abrir un visor PDF, descargar, o emitir evento
    if(this.onView.observers.length > 0) {
        this.onView.emit(item);
    } else {
        const url = URL.createObjectURL(item.file);
        window.open(url, '_blank');
    }
  }

  private emitChange() {
    this.filesChanged.emit(this.files);
  }
}