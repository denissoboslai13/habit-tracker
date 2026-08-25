import { Component, inject, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LogService } from '../../services/log-service/log-service';
import { indLog } from '../../models/log.type';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-log',
  imports: [ReactiveFormsModule],
  templateUrl: './add-log.html',
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

export class AddLog {
  logService = inject(LogService)
  id = input('');
  logAdded = output<indLog>();
  trueAdded = output<indLog>();
  addVis = signal(false);
  toastr = inject(ToastrService);
  
  getTodayString(): string {
    return new Date().toISOString().split('T')[0]
  }

  profileForm = new FormGroup({
    date: new FormControl(this.getTodayString(), { nonNullable: true, validators: [Validators.required] }),
    completed: new FormControl(false, { nonNullable: true }),
  });

  onSubmit(){
    console.log(this.profileForm.getRawValue())
    this.logService
    .postLog(this.id(), this.profileForm.getRawValue()).subscribe({
      next: (createdLog: any) => {
        console.log(createdLog)
        this.logAdded.emit(createdLog);
        this.toastr.success(`Logged for today! Good Job!`, 'Success');
        if (createdLog.completed) {
          this.trueAdded.emit(createdLog);
        }
        this.profileForm.reset()
      },
      error: (err) => {
        console.error('Failed to add habit:', err)
        this.toastr.error(`Couldnt create a log, try again please!`, 'Error');
        this.profileForm.reset()
      }
    })
    this.addVis.set(false)
    document.body.style.overflow = ''
  }

  onVisClick() {
    this.addVis.update(p => p == true ? false : true);
    if (this.addVis()) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
}
