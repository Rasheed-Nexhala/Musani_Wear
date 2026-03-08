# Jest for Angular – Reference

## Mock Functions

```typescript
const mockFn = jest.fn();
mockFn(); // call
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
expect(mockFn).toHaveBeenCalledTimes(2);

// Return values
jest.fn().mockReturnValue(42);
jest.fn().mockReturnValue(of('value'));  // RxJS
jest.fn().mockResolvedValue(data);       // Promise
jest.fn().mockRejectedValue(new Error()); // Promise reject
```

## Mocking Modules

```typescript
jest.mock('./my-service', () => ({
  MyService: jest.fn().mockImplementation(() => ({
    getData: jest.fn().mockReturnValue(of([])),
  })),
}));
```

## Async Tests

```typescript
// Promise
it('resolves', async () => {
  const result = await myAsyncFn();
  expect(result).toBe('ok');
});

// RxJS (done callback)
it('emits value', (done) => {
  service.getData().subscribe(data => {
    expect(data).toEqual([]);
    done();
  });
});

// RxJS (fakeAsync)
import { fakeAsync, tick } from '@angular/core/testing';
it('emits after delay', fakeAsync(() => {
  let result: unknown;
  service.getData().subscribe(d => result = d);
  tick(100);
  expect(result).toBeDefined();
}));
```

## Matchers

```typescript
expect(x).toBe(y);           // strict equality
expect(x).toEqual(y);        // deep equality
expect(x).toBeNull();
expect(x).toBeDefined();
expect(x).toBeTruthy();
expect(x).toContain('sub');
expect(arr).toContainEqual({ id: 1 });
expect(x).toMatch(/pattern/);
expect(fn).toThrow();
expect(fn).toThrowError('message');
expect.objectContaining({ a: 1 });
expect.any(String);
expect.stringContaining('sub');
```

## TestBed for Services

```typescript
beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      MyService,
      { provide: DepService, useValue: mockDep },
    ],
  });
  service = TestBed.inject(MyService);
});
```

## ESM Projects

If using ESM, use `createEsmPreset()` instead of `createCjsPreset()` in jest.config.ts.
