import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NavbarService {
  public isNavbarSearchSubject = new BehaviorSubject<boolean>(false);
  isNavbarSearch$ = this.isNavbarSearchSubject.asObservable();

  openModal() {
    this.isNavbarSearchSubject.next(true);
  }

  closeModal() {
    this.isNavbarSearchSubject.next(false);
  }
  
}
