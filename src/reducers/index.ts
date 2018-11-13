import { Action } from 'redux';
import { State } from '../types';
import { actionTypes } from '../actions';

const initialState = { authenticating: true };

export default function(state: State = initialState, action: Action & {[key: string]: any}) {
  switch (action.type) {
    case actionTypes.UPDATE:
      return { ...state, ...action.updates };
    default:
      return state;
  }
}
