import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLog } from './add-log';

describe('AddLog', () => {
  let component: AddLog;
  let fixture: ComponentFixture<AddLog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddLog],
    }).compileComponents();

    fixture = TestBed.createComponent(AddLog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
