import { render, cleanup, screen } from 'solid-testing-library';
import { SwatchesProvider } from '../../contexts/swatches';
import MainView from '../MainView';

describe('<MainView />', () => {
  afterEach(cleanup);

  it('should rendered in the dom', () => {
    const { unmount } = render(() => (
      <SwatchesProvider>
        <MainView />
      </SwatchesProvider>
    ));

    const ctn = screen.getByTestId('main-view');

    expect(ctn).toBeInTheDocument();
    expect(ctn.childElementCount).toBe(2);

    unmount();
  });
});
