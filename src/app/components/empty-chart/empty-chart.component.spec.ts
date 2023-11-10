import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyChartComponent } from './empty-chart.component';

describe('EmptyChartComponent', () => {
  let component: EmptyChartComponent;
  let fixture: ComponentFixture<EmptyChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmptyChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
