import App from './App';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import createStore from './source/Reducer';
const AppWrapper = () => {
  const store = createStore();
  return (
    <Provider store={store}>
      <App />
    </Provider>

  )
}
export default AppWrapper;