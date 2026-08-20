import { Component, inject, input, output } from '@angular/core';
import { HabitService } from '../../services/habit-service/habit-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Habit } from '../../models/habit.type';

@Component({
  selector: 'app-add-habit',
  imports: [ReactiveFormsModule],
  templateUrl: './add-habit.html',
  styles: ``,
})
export class AddHabit {
  habitService = inject(HabitService)
  habitAdded = output<Habit>();

  profileForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    color: new FormControl('#EF4444', { nonNullable: true, validators: [Validators.required] })
  });

  onSubmit() {
    console.log(this.profileForm.getRawValue())
    this.habitService.postHabit(this.profileForm.getRawValue()).subscribe({
      next: (createdHabit: any) => {
        console.log(createdHabit)
        this.habitAdded.emit(createdHabit);
        this.profileForm.reset()
      },
      error: (err) => console.error('Failed to add habit:', err)
    });
  }
}
