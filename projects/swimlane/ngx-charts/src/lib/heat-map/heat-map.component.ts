import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ContentChild,
  TemplateRef,
  Output,
  EventEmitter
} from '@angular/core';
import { scaleBand } from 'd3-scale';

import { BaseChartComponent } from '../common/base-chart.component';
import { ViewDimensions } from '../common/view-dimensions.helper';
import { ColorHelper } from '../common/color.helper';

@Component({
  selector: 'ngx-charts-heat-map',
  template: `
    <ngx-charts-chart
      [view]="[width, height]"
      [showLegend]="legend"
      [animations]="animations"
      [legendOptions]="legendOptions"
      (legendLabelClick)="onClick($event)"
    >
      <svg:g [attr.transform]="transform" class="heat-map chart">
        <svg:g
          ngx-charts-x-axis
          *ngIf="xAxis"
          [xScale]="xScale"
          [dims]="dims"
          [showLabel]="showXAxisLabel"
          [labelText]="xAxisLabel"
          [trimTicks]="trimXAxisTicks"
          [rotateTicks]="rotateXAxisTicks"
          [maxTickLength]="maxXAxisTickLength"
          [tickFormatting]="xAxisTickFormatting"
          [ticks]="xAxisTicks"
          (dimensionsChanged)="updateXAxisHeight($event)"
        ></svg:g>
        <svg:g
          ngx-charts-y-axis
          *ngIf="yAxis"
          [yScale]="yScale"
          [dims]="dims"
          [showLabel]="showYAxisLabel"
          [labelText]="yAxisLabel"
          [trimTicks]="trimYAxisTicks"
          [maxTickLength]="maxYAxisTickLength"
          [tickFormatting]="yAxisTickFormatting"
          [ticks]="yAxisTicks"
          (dimensionsChanged)="updateYAxisWidth($event)"
        ></svg:g>
        <svg:rect
          *ngFor="let rect of rects"
          [attr.x]="rect.x"
          [attr.y]="rect.y"
          [attr.rx]="rect.rx"
          [attr.width]="rect.width"
          [attr.height]="rect.height"
          [attr.fill]="rect.fill"
        />
        <svg:g
          ngx-charts-heat-map-cell-series
          [xScale]="xScale"
          [yScale]="yScale"
          [colors]="colors"
          [data]="results"
          [gradient]="gradient"
          [animations]="animations"
          [tooltipDisabled]="tooltipDisabled"
          [tooltipTemplate]="tooltipTemplate"
          [tooltipText]="tooltipText"
          (select)="onClick($event)"
          [showDataLabel]="showDataLabel"
        />
      </svg:g>
    </ngx-charts-chart>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../common/base-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeatMapComponent extends BaseChartComponent {
  @Input() legend;
  @Input() legendTitle: string = 'Legend';
  @Input() legendPosition: string = 'right';
  @Input() xAxis;
  @Input() yAxis;
  @Input() showXAxisLabel;
  @Input() showYAxisLabel;
  @Input() xAxisLabel;
  @Input() yAxisLabel;
  @Input() gradient: boolean;
  @Input() innerPadding: number | number[] = 8;
  @Input() trimXAxisTicks: boolean = true;
  @Input() trimYAxisTicks: boolean = true;
  @Input() rotateXAxisTicks: boolean = true;
  @Input() maxXAxisTickLength: number = 16;
  @Input() maxYAxisTickLength: number = 16;
  @Input() xAxisTickFormatting: any;
  @Input() yAxisTickFormatting: any;
  @Input() xAxisTicks: any[];
  @Input() yAxisTicks: any[];
  @Input() tooltipDisabled: boolean = false;
  @Input() tooltipText: any;
  @Input() min: number;
  
  // Option to show data labels on heat map cells
  @Input() showDataLabel: boolean = false;

  @Output() select: EventEmitter<{ name: string; value: any }> = new EventEmitter();

  @ContentChild('tooltipTemplate') tooltipTemplate: TemplateRef<any>;

  dims: ViewDimensions;
  xDomain: string[];
  yDomain: string[];
  valueDomain: any[];
  xScale: any;
  yScale: any;
  color: any;
  colors: ColorHelper;
  colorScale: any;
  transform: string;
  rects: any[];
  margin = [10, 20, 10, 20];
  xAxisHeight: number = 0;
  yAxisWidth: number = 0;
  legendOptions: any;
  scaleType: string = 'linear';

  update(): void {
    super.update();

    this.formatDates();

    this.xDomain = this.getXDomain();
    this.yDomain = this.getYDomain();
    this.valueDomain = this.getValueDomain();

    this.scaleType = this.getScaleType(this.valueDomain);

    this.dims = this.calculateDims();
    this.formatLabels();

    this.xScale = this.getXScale();
    this.yScale = this.getYScale();

    this.setColors();
    this.legendOptions = this.getLegendOptions();

    this.transform = `translate(${this.dims.xOffset} , ${this.margin[0]})`;
    this.rects = this.getRects();
  }

  getXDomain(): any[] {
    const domain = [];
    for (const group of this.results) {
      if (!domain.includes(group.name)) {
        domain.push(group.name);
      }
    }

    return domain;
  }

  getYDomain(): any[] {
    const domain = [];

    for (const group of this.results) {
      for (const d of group.series) {
        if (!domain.includes(d.name)) {
          domain.push(d.name);
        }
      }
    }

    return domain;
  }

  getValueDomain(): any[] {
    const domain = [];

    for (const group of this.results) {
      for (const d of group.series) {
        if (!domain.includes(d.value)) {
          domain.push(d.value);
        }
      }
    }

    const min = this.min !== undefined ? this.min : Math.min(0, ...domain);
    const max = Math.max(...domain);

    return [min, max];
  }

  getScaleType(domain): string {
    return this.scaleType;
  }

  getXScale(): any {
    const spacing = this.xDomain.length / (this.dims.width / this.barPadding + 1);
    return scaleBand().range([0, this.dims.width]).paddingInner(spacing).domain(this.xDomain);
  }

  getYScale(): any {
    const spacing = this.yDomain.length / (this.dims.height / this.barPadding + 1);
    return scaleBand().range([this.dims.height, 0]).paddingInner(spacing).domain(this.yDomain);
  }

  getXScaleBand(): number {
    const bandwidth = this.xScale.bandwidth();
    return bandwidth;
  }

  getYScaleBand(): number {
    const bandwidth = this.yScale.bandwidth();
    return bandwidth;
  }

  getRects(): any[] {
    const rects = [];

    this.xDomain.map(xVal => {
      this.yDomain.map(yVal => {
        rects.push({
          x: this.xScale(xVal),
          y: this.yScale(yVal),
          rx: 3,
          width: this.xScale.bandwidth(),
          height: this.yScale.bandwidth(),
          fill: 'rgba(200,200,200,0.03)'
        });
      });
    });

    return rects;
  }

  onClick(data): void {
    this.select.emit(data);
  }

  setColors(): void {
    this.colors = new ColorHelper(this.scheme, this.scaleType, this.valueDomain);
  }

  getLegendOptions() {
    return {
      scaleType: this.scaleType,
      domain: this.valueDomain,
      colors: this.scaleType === 'ordinal' ? this.colors : this.colors.scale,
      title: this.legendTitle,
      position: this.legendPosition
    };
  }

  updateYAxisWidth({ width }): void {
    this.yAxisWidth = width;
    this.update();
  }

  updateXAxisHeight({ height }): void {
    this.xAxisHeight = height;
    this.update();
  }

  onActivate(event, group, fromLegend = false) {
    const item = Object.assign({}, event);
    if (group) {
      item.series = group.name;
    }

    const items = this.results
      .map(g => g.series)
      .flat()
      .filter(i => {
        if (fromLegend) {
          return i.label === item.name;
        } else {
          return i.name === item.name && i.series === item.series;
        }
      });

    this.activeEntries = [...items];
    this.activate.emit({ value: item, entries: this.activeEntries });
  }

  onDeactivate(event, group, fromLegend = false) {
    const item = Object.assign({}, event);
    if (group) {
      item.series = group.name;
    }

    this.activeEntries = this.activeEntries.filter(i => {
      if (fromLegend) {
        return i.label !== item.name;
      } else {
        return !(i.name === item.name && i.series === item.series);
      }
    });

    this.deactivate.emit({ value: item, entries: this.activeEntries });
  }

  private getInnerPadding() {
    if (typeof this.innerPadding === 'number') {
      return this.innerPadding;
    }
    // for backwards compatibility, if innerPadding is an array, use the first value
    return this.innerPadding[0];
  }
}
