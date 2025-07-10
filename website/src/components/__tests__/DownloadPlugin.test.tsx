import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import { DownloadPlugin } from '../DownloadPlugin';
import { useAuth } from '@/hooks/useAuth';

jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

const mockUseAuth = useAuth as jest.Mock;

const mockResponse = {
  au: {
    url: 'https://example.com/au.dmg',
    sha256: 'mock-sha256',
  },
  vst3: {
    url: 'https://example.com/vst3.zip',
    sha256: 'mock-sha256',
  },
};

describe('DownloadPlugin', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({ user: { email: 'test@example.com' } });
  });

  it('renders correct primary button for macOS', () => {
    Object.defineProperty(navigator, 'platform', {
      value: 'MacIntel',
      configurable: true,
    });

    render(<DownloadPlugin />);
    const downloadButton = screen.getByRole('button', { name: /download au/i });
    expect(downloadButton).toBeInTheDocument();
  });

  it('renders correct primary button for Windows', () => {
    Object.defineProperty(navigator, 'platform', {
      value: 'Win32',
      configurable: true,
    });

    render(<DownloadPlugin />);
    const downloadButton = screen.getByRole('button', { name: /download vst3/i });
    expect(downloadButton).toBeInTheDocument();
  });

  it('falls back to manual list if userAgentData unsupported', () => {
    Object.defineProperty(navigator, 'userAgentData', {
      value: undefined,
      configurable: true,
    });

    render(<DownloadPlugin />);
    const dropdownButton = screen.getByRole('button', { name: /select format/i });
    expect(dropdownButton).toBeInTheDocument();
  });

  it('shows checksum modal', async () => {
    render(<DownloadPlugin />);
    const downloadButton = screen.getByRole('button', { name: /download/i });
    fireEvent.click(downloadButton);

    const checksumModal = await screen.findByRole('dialog');
    expect(checksumModal).toBeInTheDocument();
    expect(checksumModal).toHaveTextContent('mock-sha256');
  });

  it('passes axe accessibility tests', async () => {
    const { container } = render(<DownloadPlugin />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
