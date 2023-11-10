import { Component, ViewEncapsulation, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ChartComponent, ChartOptions } from './components/chart/chart.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorComponent } from './components/error/error.component';
import { DateFormComponent } from './components/date-form/date-form.component';

export type RandomData = {
  [key: string]: [Date, number][]
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    ChartComponent,
    ReactiveFormsModule,
    ErrorComponent,
    DateFormComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'app';
  minDate = signal<number>(Date.parse('01-01-1999'));
  maxDate = signal<number>(Date.parse('01-01-2023'));
  typesList = ['Data 1', 'Data 2', 'Data 3', 'Data 4'];
  randomData = this.createRandomSetOfData();

  setMin(date: number): void {
    this.minDate.set(date);
  }

  setMax(date: number): void {
    this.maxDate.set(date);
  }

  createRandomSetOfData(): RandomData {
    const randomData: RandomData = {};
    for (let i = 0; i < this.typesList.length; i += 1) {
      randomData[this.typesList[i]] = this.generateRandomData();
    }
    return randomData;
  }

  generateRandomData() {
    const maxdate = 2023;
    const mindate = 1999;
    let y = 1000;
    const dps: [Date, number][] = [];
		for(var i = mindate; i <= maxdate; i += 1) {
			y += Math.ceil(Math.random() * 10 - 5);
			dps.push([new Date(i + "-01-01"), y]);
		}
		return dps;
	}
}
