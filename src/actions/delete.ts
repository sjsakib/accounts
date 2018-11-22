import { Dispatch, Action } from 'redux';
import firebase from '../lib/firebase';
import history from '../lib/history';
import { update } from './index';
import { State } from '../types';

export function deleteProject(projectID: string) {
  return function(dispatch: Dispatch<Action>, getState: () => State) {
    firebase
      .firestore()
      .collection('projects')
      .doc(projectID)
      .delete()
      .then(() => {
        history.push('/');
        const projects = {...getState().projects};
        delete projects[projectID]
        dispatch(
          update({ projects })
        );
      });
  };
}
