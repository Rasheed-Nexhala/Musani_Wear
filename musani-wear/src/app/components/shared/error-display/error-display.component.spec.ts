import { render, screen, fireEvent } from '@testing-library/angular';
import { ErrorDisplayComponent } from './error-display.component';

describe('ErrorDisplayComponent', () => {
  it('renders nothing when error is null', async () => {
    await render(ErrorDisplayComponent, {
      inputs: { error: null },
    });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders error message when error is provided', async () => {
    await render(ErrorDisplayComponent, {
      inputs: { error: 'Failed to load products' },
    });
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Failed to load products')).toBeInTheDocument();
  });

  it('emits retry when Retry button is clicked', async () => {
    const onRetry = jest.fn();
    await render(ErrorDisplayComponent, {
      inputs: { error: 'Something went wrong' },
      on: { retry: onRetry },
    });
    fireEvent.click(screen.getByRole('button', { name: /retry/i }));
    expect(onRetry).toHaveBeenCalled();
  });

  it('shows Retry button by default', async () => {
    await render(ErrorDisplayComponent, {
      inputs: { error: 'Error message' },
    });
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('hides Retry button when showRetry is false', async () => {
    await render(ErrorDisplayComponent, {
      inputs: { error: 'Error message', showRetry: false },
    });
    expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument();
  });

  it('has role="alert" and aria-live for accessibility', async () => {
    await render(ErrorDisplayComponent, {
      inputs: { error: 'Error' },
    });
    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'polite');
  });
});
