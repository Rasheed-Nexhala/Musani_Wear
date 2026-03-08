import { render, screen, fireEvent } from '@testing-library/angular';
import { of, throwError } from 'rxjs';

jest.mock('@angular/fire/auth', () => ({
  Auth: {},
  authState: () => of(null),
  getAuth: () => ({}),
}));
jest.mock('@angular/fire/firestore', () => ({
  Firestore: {},
  doc: () => ({}),
  getDoc: () => Promise.resolve({ exists: () => false }),
  setDoc: () => Promise.resolve(),
  updateDoc: () => Promise.resolve(),
}));

import { AdminSettingsComponent } from './admin-settings.component';
import { SettingsService } from '../../../services/settings.service';

describe('AdminSettingsComponent', () => {
  const mockSettings = {
    businessName: 'Musani Wear',
    whatsappNumber: '+919876543210',
    businessEmail: 'contact@musaniwear.com',
    businessPhone: '+919876543210',
  };

  const mockSettingsService = {
    getSettings: jest.fn().mockReturnValue(of(mockSettings)),
    updateSettings: jest.fn().mockReturnValue(of(undefined)),
  };

  const defaultProviders = [
    { provide: SettingsService, useValue: mockSettingsService },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockSettingsService.getSettings.mockReturnValue(of(mockSettings));
    mockSettingsService.updateSettings.mockReturnValue(of(undefined));
  });

  it('renders settings form with all fields', async () => {
    await render(AdminSettingsComponent, { providers: defaultProviders });

    expect(screen.getByRole('heading', { name: /business settings/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/business name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/whatsapp number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/business email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/business phone/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('calls updateSettings when form is valid and save is clicked', async () => {
    await render(AdminSettingsComponent, { providers: defaultProviders });

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(mockSettingsService.updateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        businessName: 'Musani Wear',
        whatsappNumber: '+919876543210',
        businessEmail: 'contact@musaniwear.com',
        businessPhone: '+919876543210',
      })
    );
  });

  it('shows success message after successful save', async () => {
    await render(AdminSettingsComponent, { providers: defaultProviders });

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(screen.getByText(/settings saved successfully/i)).toBeInTheDocument();
  });

  it('shows inline error message when updateSettings fails', async () => {
    mockSettingsService.updateSettings.mockReturnValue(
      throwError(() => new Error('Network error'))
    );

    await render(AdminSettingsComponent, { providers: defaultProviders });

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(screen.getByRole('alert')).toHaveTextContent('Network error');
  });
});
