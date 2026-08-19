import { Component, inject } from '@angular/core';
import { HabitService } from '../../services/habit-service/habit-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-habit',
  imports: [ReactiveFormsModule],
  templateUrl: './add-habit.html',
  styles: ``,
})
export class AddHabit {
  habitService = inject(HabitService)

  profileForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  onSubmit() {
    console.log(this.profileForm.getRawValue())
    this.habitService
    .postHabit(this.profileForm.getRawValue())
    .subscribe(res => {
      console.log(res)
    })
  }
}
