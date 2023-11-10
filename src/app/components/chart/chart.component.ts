import { ChangeDetectionStrategy, Component, signal, Input, OnChanges, SimpleChanges, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownDirective } from 'src/app/core/directives/dropdown.directive';
import { HighchartsChartModule } from 'highcharts-angular';
import Highcharts from 'highcharts/es-modules/masters/highcharts.src';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmptyChartComponent } from '../empty-chart/empty-chart.component';
import { RandomData } from 'src/app/app.component';

export type ChartType = 'line' | 'column' | null;
export type ChartOptions = {
  type: 'line' | 'column';
  data: [Date, number][];
};

function getDateFormat(length: number): (date: Date) => string {
  if (length > 10) {
    return (date: Date) => `${date.getFullYear()}`;
  } else {
    return (date: Date) => `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }
}

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, DropdownDirective, HighchartsChartModule, EmptyChartComponent],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent implements OnChanges {

  @Input({ required: true }) data: RandomData = {};
  @Input({ required: true }) minDate!: number;
  @Input({ required: true }) maxDate!: number;
  @Input() title = '';

  highcharts: typeof Highcharts = Highcharts;

  options!: Highcharts.Options;
  filteredData = signal<RandomData>({});
  chartType = signal<ChartType>(null);
  updateChart = computed(() => this.initializeChart());
  private chartData = signal<RandomData>({});

  ngOnChanges(changes: SimpleChanges): void {
    if (this.chartType()) {
      if (changes['minDate'] || changes['maxDate']) {
        this.setChartData();
        this.updateChart();
      }
    }
  }

  setData(dataKeys: string[]) {
    this.filteredData.set(
      dataKeys.reduce((acc, key) => {
        acc[key] = this.data[key];
        return acc;
      },
      {} as RandomData
    ));
  }

  setChartData(): void {
    const newData = Object.entries(this.filteredData())
      .reduce(
        (acc, data) => {
          acc[data[0]] = data[1].filter((items) => {
              const date = Date.parse(items[0].toString());
              return date > this.minDate && date < this.maxDate;
            });
          return acc;
        },
        {} as RandomData
      );
    this.chartData.set(newData);
  }

  setChartType(type: ChartType) {
    this.chartType.set(type);
    this.setChartData();
    this.updateChart();
  }

  private initializeChart() {
    const data = Object.entries(this.chartData());
    const categoriesData = data[0][1];
    const getDateString = getDateFormat(categoriesData.length);

    return (this.options = {
      title: {
        text: this.title || data.map((values) => values[0]).join(', '),
      },
      xAxis: {
        categories: categoriesData.map((values) => getDateString(values[0])),
        minRange: 1,
        title: {
          text: 'Date'
        },
      },
      yAxis: {
        startOnTick: true,
        endOnTick: false,
        maxPadding: 0.35,
      },
      tooltip: {
        headerFormat: 'Date: {point.x:.1f}<br>',
        pointFormat: 'Value: {point.y} ',
        shared: true
      },
      series: data.map((items) => ({
        type: this.chartType() || 'line',
        name: items[0],
        data: items[1]
      })),
    });
  }
}
