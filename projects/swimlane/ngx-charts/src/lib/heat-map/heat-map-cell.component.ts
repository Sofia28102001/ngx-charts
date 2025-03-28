import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, TemplateRef, SimpleChanges } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'ngx-charts-heat-map-cell',
  template: `
    <svg:rect
      [attr.fill]="fill"
      [attr.rx]="rx"
      [attr.ry]="ry"
      [attr.width]="width"
      [attr.height]="height"
      [attr.x]="x"
      [attr.y]="y"
      class="cell"
      (click)="onClick()"
    />
    <svg:text
      *ngIf="showDataLabel"
      [attr.x]="x + width / 2"
      [attr.y]="y + height / 2"
      dy=".35em"
      text-anchor="middle"
      [style.font-size.px]="dataLabelFontSize"
      >{{ formattedLabel }}</svg:text>
    <svg:title *ngIf="!tooltipDisabled">{{ tooltipText }}</svg:title>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeatMapCellComponent {
  @Input() tooltipDisabled: boolean = false;
  @Input() tooltipText: string;
  @Input() tooltipTemplate: TemplateRef<any>;
  @Input() showDataLabel: boolean = false;
  @Input() dataLabelFormatting: any;
  @Input() dataLabelFontSize: number = 11;
  @Input() bandHeight: number;
  @Input() animations: boolean = true;

  rx: number;
  ry: number;
  id: string;
  formattedLabel: string;

  ngOnChanges(changes: SimpleChanges): void {
    this.update();
  }

  update(): void {
    this.formattedLabel = this.getFormattedLabel();
  }

  getFormattedLabel(): string {
    const value = this.value;
    return this.dataLabelFormatting ? this.dataLabelFormatting(value) : value.toLocaleString();
  }

  onClick(): void {
    this.select.emit(this.data);
  }
}