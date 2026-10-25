import { Component } from '@angular/core';
import { RandomNovelComponent } from '../../../features/novels/components';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [RandomNovelComponent],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css'
})
export class AsideComponent {

}
