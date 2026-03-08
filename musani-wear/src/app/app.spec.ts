import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { App } from './app';
import { AuthService } from './services/auth.service';
import { SeedService } from './services/seed.service';

jest.mock('@angular/fire/auth', () => ({
  Auth: {},
  authState: () => of(null),
  getAuth: () => ({}),
}));

jest.mock('@angular/fire/firestore', () => ({
  Firestore: {},
  collection: () => ({}),
  addDoc: () => Promise.resolve({ id: 'mock-id' }),
  query: () => ({}),
  where: () => ({}),
  getDocs: () => Promise.resolve({ empty: true }),
}));

describe('App', () => {
  const mockSeedService = { seedCategories: jest.fn().mockResolvedValue(undefined) };
  const mockAuthService = { isAuthenticated$: of(false) };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        { provide: SeedService, useValue: mockSeedService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render navbar and main content', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-navbar')).toBeTruthy();
    expect(compiled.querySelector('main')).toBeTruthy();
    expect(compiled.querySelector('app-footer')).toBeTruthy();
  });
});
