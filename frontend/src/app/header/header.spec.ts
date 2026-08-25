import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Header } from './header';
import { ToastrModule, ToastrService } from 'ngx-toastr';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header, ToastrModule.forRoot()],
      providers: [ToastrService]
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
