import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HabitService } from '../../services/habit-service/habit-service';
import { Habit } from '../../models/habit.type';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-habit',
  imports: [ReactiveFormsModule],
  templateUrl: './update-habit.html',
  styles: `
    @keyframes fadeIn {
      from { opacity: 0 }
      to { opacity: 1 }
    }
    @keyframes fadeOut {
      from { opacity: 1 }
      to { opacity: 0 }
    }

    .fade-in { animation: fadeIn 300ms ease-out; }
    .fade-out { animation: fadeOut 300ms ease-in; }
  `,
})
export class UpdateHabit {
  id = input.required<string>();
  cancelled = output();
  habitUpdated = output<Habit>();
  habitService = inject(HabitService)
  toastr = inject(ToastrService);

  profileForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  onExitVis() {
    this.cancelled.emit()
  }

  onSubmit() {
    this.habitService
    .updateHabit(this.id(), this.profileForm.getRawValue()).subscribe({
      next: (updatedHabit: any) => {
        console.log(updatedHabit)
        this.habitUpdated.emit(updatedHabit);
        this.profileForm.reset()
        this.toastr.success(`Updated habit name to ${updatedHabit.name} `, 'Success');
      },
      error: () => {

      }
    })
  }
}
