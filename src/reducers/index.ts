import { Action } from 'redux';
import { State } from '../types';
import { actionTypes } from '../actions';

const initialState = {
  authenticating: true,
  showModal: false,
  modalLoading: false,
  modalMessage: '',
  projects: {}
};

export default function(
  state: State = initialState,
  action: Action & { [key: string]: any }
) {
  switch (action.type) {
    case actionTypes.UPDATE:
      return { ...state, ...action.updates };
    default:
      return state;
  }
}
