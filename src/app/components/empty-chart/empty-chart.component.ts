import { Component, Output, EventEmitter, Input, signal, computed,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartType } from '../chart/chart.component';
import { DropdownDirective } from 'src/app/core/directives/dropdown.directive';
import { RandomData } from 'src/app/app.component';

@Component({
  selector: 'app-empty-chart',
  standalone: true,
  imports: [CommonModule, DropdownDirective],
  templateUrl: './empty-chart.component.html',
  styleUrl: './empty-chart.component.scss'
})
export class EmptyChartComponent implements OnInit {

  @Output() chartType = new EventEmitter<ChartType>();
  @Output() chartDataTypes = new EventEmitter<string[]>();

  @Input({ required: true }) data: RandomData = {};

  dataTypesList = signal<string[]>([]);
  dataTypes = signal<string[]>([]);
  dataTypeValue = computed(() => this.dataTypes().join(', '));

  ngOnInit(): void {
    this.dataTypesList.set(Object.keys(this.data));
  }

  setDataTypeValue(target: HTMLInputElement, type: string): void {
    if (target.checked) {
      this.dataTypes.update((prev) => [...prev, type]);
    } else {
      this.dataTypes.update(
        (prev) => prev.filter((value) => value !== type)
      );
    }
    this.chartDataTypes.emit(this.dataTypes());
    this.dataTypeValue();
  }

  setChartType(type: ChartType) {
    if (this.dataTypeValue().length) {
      this.chartType.emit(type);
    }
  }
}
