import { render, screen } from '@testing-library/angular';
import { LoadingSkeletonComponent } from './loading-skeleton.component';

describe('LoadingSkeletonComponent', () => {
  it('renders loading status with aria-label', async () => {
    await render(LoadingSkeletonComponent);
    expect(
      screen.getByRole('status', { name: /loading products/i })
    ).toBeInTheDocument();
  });

  it('renders default 4 skeleton cards', async () => {
    await render(LoadingSkeletonComponent);
    const cards = document.querySelectorAll('.bg-white.rounded-lg');
    expect(cards.length).toBe(4);
  });

  it('renders custom count when count input is set', async () => {
    await render(LoadingSkeletonComponent, {
      inputs: { count: 6 },
    });
    const cards = document.querySelectorAll('.bg-white.rounded-lg');
    expect(cards.length).toBe(6);
  });

  it('has accessible structure with role status', async () => {
    await render(LoadingSkeletonComponent);
    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-label', 'Loading products');
  });
});
