import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLog } from './add-log';
import { ToastrModule, ToastrService } from 'ngx-toastr';

describe('AddLog', () => {
  let component: AddLog;
  let fixture: ComponentFixture<AddLog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddLog, ToastrModule.forRoot()],
      providers: [ToastrService]
    }).compileComponents();

    fixture = TestBed.createComponent(AddLog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
