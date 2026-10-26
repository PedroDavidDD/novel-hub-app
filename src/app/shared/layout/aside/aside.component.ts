import { Component } from '@angular/core';
import { RandomNovelComponent } from '../../../features/novels/components';
import { CustomButtonComponent } from '../../components/custom-button/custom-button.component';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [RandomNovelComponent, CustomButtonComponent],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css'
})
export class AsideComponent {

}
