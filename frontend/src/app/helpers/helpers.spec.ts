import { calcDaily } from './calcDaily';
import { dateKey } from './dateKey';

describe('dateKey', () => {
  it('formats a local date as YYYY-MM-DD', () => {
    const d = new Date(2026, 7, 22);
    expect(dateKey(d)).toBe('2026-08-22');
  });

  it('pads single-digit months and days', () => {
    const d = new Date(2026, 0, 5);
    expect(dateKey(d)).toBe('2026-01-05');
  });

  it('does not shift the date due to UTC conversion', () => {
    const d = new Date(2026, 7, 1);
    expect(dateKey(d)).not.toBe('2026-07-31');
  });
});

describe('calcDaily', () => {
  it('correctly calculates todays progress', () => {
    const data = {
        "habits": [{"color": "#test", "id": "1", "name": "test1"}, {"color": "#test", "id": "2", "name": "test2"}, {"color": "#test", "id": "3", "name": "test3"}],
        "logs": [{"completed": true, "date": "Tue, 25 Aug 2026 00:00:00 GMT", "id": "1"}, {"completed": true, "date": "Tue, 25 Aug 2026 00:00:00 GMT", "id": "2"}, {"completed": false, "date": "Tue, 25 Aug 2026 00:00:00 GMT", "id": "3"}]
    }
    expect(calcDaily(data).total).toBe(3);
    expect(calcDaily(data).completed).toBe(2);
    expect(calcDaily(data).percentage).toBe("66.67");
  });

  it('doesnt throw if todays progress is 0', () => {
    const data = {
        "habits": [{"color": "#test", "id": "1", "name": "test1"}, {"color": "#test", "id": "2", "name": "test2"}, {"color": "#test", "id": "3", "name": "test3"}],
        "logs": []
    }
    expect(calcDaily(data).total).toBe(3);
    expect(calcDaily(data).completed).toBe(0);
    expect(calcDaily(data).percentage).toBe("0");
  });
});