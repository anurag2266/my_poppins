import {createStore} from 'redux';
import reducers from './reducer';
import initialState from './initialState';

export default () => {
  return createStore(reducers, initialState);
};
