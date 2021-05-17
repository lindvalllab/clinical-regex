import { render, screen } from '@testing-library/react';
import App from './App';
import { ApiContext } from './api';
import ElectronApi from '../api/electron';
jest.mock('../api/electron');

test('renders learn react link', () => {
  const api = new ElectronApi(); // This is mocked by jest above.
  render(
    <ApiContext.Provider value={api}>
      <App />
    </ApiContext.Provider>
  );
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
