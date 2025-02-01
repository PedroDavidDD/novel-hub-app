import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NovelsService } from '../../services/novels.service';
import { Subscriber, Subscription } from 'rxjs';

@Component({
  selector: 'app-novels-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './novels-page.component.html',
  styleUrl: './novels-page.component.css',
})
export class NovelsPageComponent implements OnInit, OnDestroy{
  // Definir opciones de filtro
  languages: string[] = ['Any', 'Chinese', 'Korean'];
  statuses: string[] = ['Any', 'Ongoing', 'Completed', 'Hiatus'];
  sortByOptions: string[] = ['Name', 'Popular', 'Chapters', 'New', 'Rating'];
  // Variables para los filtros seleccionados
  selectedLanguage: string = 'Any';
  selectedStatus: string = 'Any';
  selectedSort: string = 'Name';

  // Lista de novelas
  novelsService$: Subscription;
  novels: any[] = [];
  tempListNovels: any[] = []; // Guarda la lista original sin filtrar

  constructor(private novelsService: NovelsService) {

    // Suscribirse al observable para obtener las novelas
    this.novelsService$ = this.novelsService.getNovels().subscribe({
      next: data => {
        this.novels = data;
        this.tempListNovels = [...data];
        this.applyFilters(); // Aplicamos los filtros iniciales
      },
      error: error => {
        this.novels = [];
        this.tempListNovels = [];
      }
    });

  }

  ngOnInit(): void {
    console.log('Novels:', this.novels);
  }

  // Métodos para actualizar los filtros
  filterByLanguage(language: string): void {
    this.selectedLanguage = language;
    this.applyFilters();
  }

  filterByStatus(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  sortBy(option: string): void {
    this.selectedSort = option;
    this.applyFilters();
  }

  // Método privado para aplicar los filtros y ordenamientos
  private applyFilters(): void {
    // Aplicar filtros a la lista original
    this.novels = this.tempListNovels.filter(novel => {
      const languageMatch = this.selectedLanguage === 'Any' || novel.language === this.selectedLanguage;
      const statusMatch = this.selectedStatus === 'Any' || novel.status === this.selectedStatus;
      return languageMatch && statusMatch;
    });

    // Mapeo de funciones de ordenación
    const sortFunctions: { [key: string]: (a: any, b: any) => number } = {
      'Name': (a, b) => a.title.localeCompare(b.title),
      'Popular': (a, b) => b.popularity - a.popularity,
      'Chapters': (a, b) => b.chapters - a.chapters,
      'New': (a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime(),
      'Rating': (a, b) => b.rating - a.rating
    };
    // Aplicar ordenamiento
    if (this.selectedSort && sortFunctions[this.selectedSort]) {
      this.novels.sort(sortFunctions[this.selectedSort]);
    }
  }

  ngOnDestroy () {
    this.novelsService$.unsubscribe();
  }
}
