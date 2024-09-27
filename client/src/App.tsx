import React from 'react';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import store from './redux/store';
import BoardList from './components/BoardList';
import './styles/App.css';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <div>
          <h1>Task Management Boards</h1>
          <BoardList />
        </div>
      </DndProvider>
    </Provider>
  );
};

export default App;
