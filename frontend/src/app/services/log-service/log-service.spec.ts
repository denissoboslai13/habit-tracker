import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { LogService } from './log-service';

function fail(reason = "fail was called in a test.") {
  throw new Error(reason);
}

describe('HabitService', () => {
  let service: LogService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LogService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(LogService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('fetches habits from the correct endpoint', () => {
    const mockLogs = [{ id: '1', name: 'Reading', color: '#3B82F6' }];

    service.getInterval(mockLogs[0].id).subscribe(logs => {
      expect(logs).toEqual(mockLogs);
    });

    const req = httpMock.expectOne(`http://127.0.0.1:4141/api/habits/${mockLogs[0].id}/logs`);
    expect(req.request.method).toBe('GET');
    req.flush(mockLogs);
  });

  it('sends withCredentials on requests', () => {
    service.getInterval("1").subscribe();
    const req = httpMock.expectOne('http://127.0.0.1:4141/api/habits/1/logs');
    expect(req.request.withCredentials).toBe(true);
    req.flush([]);
  });

  it('propagates an error when the request fails', () => {
    service.getInterval("1").subscribe({
      next: () => fail('expected an error, got success'),
      error: (err) => expect(err.status).toBe(500),
    });

    const req = httpMock.expectOne('http://127.0.0.1:4141/api/habits/1/logs');
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
  });
});