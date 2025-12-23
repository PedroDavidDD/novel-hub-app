import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdsCarouselComponent } from './ads-carousel/ads-carousel.component';
import { JapaneseAdsComponent } from './japanese-ads/japanese-ads.component';

@Component({
  selector: 'app-ads',
  standalone: true,
  imports: [AdsCarouselComponent, JapaneseAdsComponent],
  templateUrl: './ads.component.html',
  styleUrl: './ads.component.css'
})
export class AdsComponent implements OnInit, OnDestroy {

  isMobile: boolean = false;
  
  onResize() {
    this.isMobile = window.innerWidth <= 768;
  }
  
  ngOnInit() {
    this.onResize();
    window.addEventListener('resize', this.onResize.bind(this));
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.onResize.bind(this));
  }
}
