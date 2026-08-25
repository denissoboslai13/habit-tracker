import { Component, inject, input, output, signal } from '@angular/core';
import { HabitService } from '../../services/habit-service/habit-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LucidePlus } from '@lucide/angular';
import { NewHabit } from '../../models/newHabit.type';
import { Habit } from '../../models/habit.type';

@Component({
  selector: 'app-add-habit',
  imports: [ReactiveFormsModule, LucidePlus],
  templateUrl: './add-habit.html',
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

export class AddHabit {
  habitService = inject(HabitService)
  habitAdded = output<Habit>();
  addVis = signal(false);
  toastr = inject(ToastrService);

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
        this.toastr.success(`Added ${createdHabit.name} as a habit!`, 'Success');
      },
      error: (err) => {
        console.error('Failed to add habit:', err)
        this.toastr.error('Something went wrong', 'Error');
        this.profileForm.reset()
      }
    });
    this.addVis.set(false)
    document.body.style.overflow = ''
  }
  
  onVisClick() {
    this.profileForm.reset()
    this.addVis.update(p => p == true ? false : true);
    if (this.addVis()) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
}
