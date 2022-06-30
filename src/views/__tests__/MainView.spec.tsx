import { render, cleanup, screen } from 'solid-testing-library';
import MainView from '../MainView';

describe('<MainView />', () => {
  afterEach(cleanup);

  it('should rendered in the dom', () => {
    const { unmount } = render(() => <MainView />);

    const ctn = screen.getByTestId('main-view');

    expect(ctn).toBeInTheDocument();
    expect(ctn.childElementCount).toBe(2);

    unmount();
  });
});
