import { Directive, Input, TemplateRef, inject, OnInit, ViewContainerRef } from "@angular/core";
import Highcharts from 'highcharts/es-modules/masters/highcharts.src';
import { HighchartsChartComponent } from 'highcharts-angular';

@Directive({
  selector: '[chart]',
  standalone: true
})
export class ChartDirective implements OnInit {

  @Input({ alias: 'chart' }) options!: Highcharts.Options;
  highcharts: typeof Highcharts = Highcharts;

  private viewContainer = inject(ViewContainerRef);

  ngOnInit(): void {
    const component = this.viewContainer.createComponent(HighchartsChartComponent);
    component.setInput('Highcharts', this.highcharts);
    component.setInput('options', this.options);
  }
}
