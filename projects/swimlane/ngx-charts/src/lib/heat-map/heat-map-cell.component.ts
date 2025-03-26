import {
  Component,
  Input,
  OnChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import { formatLabel } from '../common/label.helper';

@Component({
  selector: 'ngx-charts-heat-map-cell',
  template: `
    <svg:g>
      <svg:rect
        [attr.x]="x"
        [attr.y]="y"
        [attr.rx]="rx"
        [attr.width]="width"
        [attr.height]="height"
        [attr.fill]="fill"
        (click)="onClick()"
      />
      <svg:text *ngIf="showDataLabel" [attr.x]="x + width / 2" [attr.y]="y + height / 2" [attr.dy]="0.35em" class="heat-map-label" [attr.text-anchor]="'middle'" [style.fill]="getTextColor()">{{data.value.toLocaleString()}}</svg:text>
    </svg:g>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeatCellComponent implements OnChanges {
  @Input() x;
  @Input() y;
  @Input() width;
  @Input() height;
  @Input() showDataLabel: boolean = false;
  @Input() data;
  @Input() label;
  @Input() gradient: boolean = false;

  ngOnChanges() {
    // Handle changes if necessary
  }

  onClick(): void {
    // Handle click event
  }

  /**
   * Determine text color based on background color contrast
   * This ensures the label is visible against the background
   */
  getTextColor(): string {
    // Extract the hex color without the '#' character
    const hex = this.fill.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#000000' : '#ffffff';
  }
}
