import { Component, inject, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LogService } from '../../services/log-service/log-service';
import { indLog } from '../../models/log.type';

@Component({
  selector: 'app-add-log',
  imports: [ReactiveFormsModule],
  templateUrl: './add-log.html',
  styles: ``,
})

export class AddLog {
  logService = inject(LogService)
  id = input('');
  logAdded = output<indLog>();
  
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
        this.profileForm.reset()
      },
      error: (err) => console.error('Failed to add habit:', err)
    })
    
  }
}
