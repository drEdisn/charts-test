import { Component, inject, Input, OnInit, Output, EventEmitter, DestroyRef, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgClass } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { dateValidator } from 'src/app/core/validators/date.validator';
import { ErrorComponent } from '../error/error.component';

@Component({
  selector: 'app-date-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, ErrorComponent],
  templateUrl: './date-form.component.html',
  styleUrl: './date-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private destroy = inject(DestroyRef);

  @Input() minDate = '01-01-1999';
  @Input() maxDate = '01-01-2023';

  @Output() minChanged = new EventEmitter<number>();
  @Output() maxChanged = new EventEmitter<number>();

  dateForm!: FormGroup;

  get controls() {
    return this.dateForm.controls;
  }

  ngOnInit(): void {
    this.dateForm = this.fb.group({
      minDate: [this.minDate, [Validators.required]],
      maxDate: [this.maxDate, [Validators.required]]
    });
    this.controls['minDate'].addValidators(
      [dateValidator(this.dateForm, this.minDate)]
    );
    this.controls['maxDate'].addValidators(
      [dateValidator(this.dateForm, this.maxDate, false)]
    );

    this.checkValues();
  }

  checkValues(): void {
    let lastMin = this.controls['minDate'].value;
    let lastMax = this.controls['maxDate'].value;

    this.dateForm.valueChanges
    .pipe(takeUntilDestroyed(this.destroy))
    .subscribe((controls) => {
      if (this.dateForm.valid) {
        if (lastMin !== controls.minDate) {
          this.minChanged.emit(Date.parse(controls.minDate));
          lastMin = controls.minDate;
        }
        if (lastMax !== controls.maxDate) {
          this.maxChanged.emit(Date.parse(controls.maxDate));
          lastMax = controls.maxDate;
        }
      }
    });
  }
}
