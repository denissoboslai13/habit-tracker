import { TestBed } from '@angular/core/testing';
import { UpdateHabit } from './update-habit';
import { ToastrModule, ToastrService } from 'ngx-toastr';

describe('Updating a habit validation', () => {
  let component: UpdateHabit;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateHabit, ToastrModule.forRoot()],
      providers: [ToastrService]
    }).compileComponents();

    const fixture = TestBed.createComponent(UpdateHabit);
    component = fixture.componentInstance;
  });

  it('is invalid when name is empty', () => {
    component.profileForm.patchValue({ name: ''});
    expect(component.profileForm.valid).toBe(false);
  });

  it('is valid with a name', () => {
    component.profileForm.patchValue({ name: 'Running'});
    expect(component.profileForm.valid).toBe(true);
  });
});