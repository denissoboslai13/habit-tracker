import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { HabitService } from './habit-service';

function fail(reason = "fail was called in a test.") {
  throw new Error(reason);
}

describe('HabitService', () => {
  let service: HabitService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HabitService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(HabitService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('fetches habits from the correct endpoint', () => {
    const mockHabits = [{ id: '1', name: 'Reading', color: '#3B82F6' }];

    service.getHabits().subscribe(habits => {
      expect(habits).toEqual(mockHabits);
    });

    const req = httpMock.expectOne('http://127.0.0.1:4141/api/habits');
    expect(req.request.method).toBe('GET');
    req.flush(mockHabits);
  });

  it('sends withCredentials on requests', () => {
    service.getHabits().subscribe();
    const req = httpMock.expectOne('http://127.0.0.1:4141/api/habits');
    expect(req.request.withCredentials).toBe(true);
    req.flush([]);
  });

  it('propagates an error when the request fails', () => {
    service.getHabits().subscribe({
      next: () => fail('expected an error, got success'),
      error: (err) => expect(err.status).toBe(500),
    });

    const req = httpMock.expectOne('http://127.0.0.1:4141/api/habits');
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
  });
});