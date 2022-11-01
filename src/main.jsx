import React from 'react';
import ReactDOM from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';

import Root from './routes/Root';
import Block from './routes/Block';
import './index.css';
import store from './store';

const router = createHashRouter([
  {
    path: '/',
    element: <Root />,
  },
  {
    path: '/blocks/:height',
    element: <Block />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
