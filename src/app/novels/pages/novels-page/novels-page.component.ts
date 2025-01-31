import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-novels-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './novels-page.component.html',
  styles: [``]
})
export class NovelsPageComponent implements OnInit {

  // Definir opciones de filtro
  languages: string[] = ['Any', 'Chinese', 'Korean'];
  statuses: string[] = ['Any', 'Ongoing', 'Completed', 'Hiatus'];
  sortByOptions: string[] = ['Name', 'Popular', 'Chapters', 'New', 'Rating'];

  // Variables para los filtros seleccionados
  selectedLanguage: string = 'Any';
  selectedStatus: string = 'Any';
  selectedSort: string = 'Name';

  // Lista de novelas con todos los datos necesarios para los filtros y ordenamientos
  novels = [
    {
      title: 'Novel 1',
      description: 'A thrilling adventure novel.',
      image: 'assets/images/novel1.jpg',
      genres: ['Action', 'Adventure'],
      language: 'Chinese',
      status: 'Ongoing',
      popularity: 1000,   // Ejemplo de campo 'popularity'
      chapters: 50,       // Ejemplo de campo 'chapters'
      releaseDate: '2023-01-01',  // Ejemplo de campo 'releaseDate'
      rating: 4.5         // Ejemplo de campo 'rating'
    },
    {
      title: 'Novel 2',
      description: 'A romantic drama novel.',
      image: 'assets/images/novel2.jpg',
      genres: ['Romance', 'Drama'],
      language: 'Korean',
      status: 'Completed',
      popularity: 1200,
      chapters: 60,
      releaseDate: '2022-05-20',
      rating: 4.7
    },
    {
      title: 'Novel 3',
      description: 'A science fiction story.',
      image: 'assets/images/novel3.jpg',
      genres: ['Sci-Fi', 'Action'],
      language: 'Chinese',
      status: 'Hiatus',
      popularity: 800,
      chapters: 45,
      releaseDate: '2021-08-15',
      rating: 4.3
    }
  ];

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

  // Método privado para aplicar los filtros
  private applyFilters(): void {
    // Filtrar y ordenar en una sola pasada
    this.novels = this.novels.filter(novel => {
      // Filtrado por idioma
      const languageMatch = this.selectedLanguage === 'Any' || novel.language === this.selectedLanguage;

      // Filtrado por estado
      const statusMatch = this.selectedStatus === 'Any' || novel.status === this.selectedStatus;

      return languageMatch && statusMatch;
    });

    // Mapeo de funciones de ordenación
    const sortFunctions: { [key: string]: (a: any, b: any) => number } = {
      'Name': (a, b) => a.title.localeCompare(b.title),
      'Popular': (a, b) => b.popularity - a.popularity, // Asumiendo que 'popularity' es un campo numérico
      'Chapters': (a, b) => b.chapters - a.chapters, // Asumiendo que 'chapters' es un número
      'New': (a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime(), // Asumiendo que 'releaseDate' es una fecha
      'Rating': (a, b) => b.rating - a.rating // Asumiendo que 'rating' es un número
    };

    // Aplicar ordenamiento solo si se ha seleccionado un tipo de ordenación
    if (this.selectedSort && sortFunctions[this.selectedSort]) {
      this.novels = this.novels.sort(sortFunctions[this.selectedSort]);
    }

    // (Opcional) Puedes agregar un log para verificar los resultados en la consola
    console.log(`Filtrando por: ${this.selectedLanguage}, ${this.selectedStatus}, Ordenando por: ${this.selectedSort}`);
  }

  ngOnInit(): void {
    // Lógica de inicialización, como cargar novelas desde un servicio
    // this.loadNovels();
  }

  // Opcional: Método para cargar las novelas de un servicio
  // loadNovels(): void {
  //   this.novelsService.getNovels().subscribe((data) => {
  //     this.novels = data;
  //   });
  // }
}
