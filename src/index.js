import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './Redux/persist'
ReactDOM.render(
     <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
     <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
  </PersistGate>
  </Provider>,
  document.getElementById('root')
);


reportWebVitals();
