import { Routes, Route } from 'solid-app-router';
import MainView from './views/MainView';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainView />} />
      <Route path="/about" element={<div>about view</div>} />
    </Routes>
  );
};

export default App;
