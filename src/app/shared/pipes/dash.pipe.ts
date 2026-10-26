import { Pipe, PipeTransform } from '@angular/core';
import { dashText, dashNumber } from '../utils/dash.util';

@Pipe({
  name: 'dash',
  standalone: true,
})
export class DashPipe implements PipeTransform {
  transform(value: unknown, type: 'text' | 'number' = 'text'): string {
    if (type === 'number') {
      return dashNumber(value as number | string | null);
    }
    return dashText(value as string | null);
  }
}
