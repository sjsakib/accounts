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
        const projects = { ...getState().projects };
        delete projects[projectID];
        dispatch(update({ projects }));
      });
  };
}

export function deleteSection(projectID: string, sectionID: string) {
  return function(dispatch: Dispatch<Action>, getState: () => State) {
    if (!window.confirm('Sure to delete sections with all entries?')) {
      return;
    }
    firebase
      .firestore()
      .collection('projects')
      .doc(projectID)
      .collection('sections')
      .doc(sectionID)
      .delete()
      .then(() => {
        history.push('/project/' + projectID);
        const projects = getState().projects;
        const project = projects[projectID];
        const sections = { ...project.sections };
        delete sections[sectionID];
        dispatch(
          update({
            projects: {
              ...projects,
              ...{ [projectID]: { ...project, ...{ sections } } }
            }
          })
        );
      });
  };
}

export function deleteEntry(
  projectID: string,
  sectionID: string,
  entryID: string
) {
  return function(dispatch: Dispatch<Action>, getState: () => State) {
    const ans = window.confirm('Sure to delete entry?');
    if (!ans) return;
    firebase
      .firestore()
      .collection('projects')
      .doc(projectID)
      .collection('sections')
      .doc(sectionID)
      .collection('entries')
      .doc(entryID)
      .delete()
      .then(() => {
        try {
          const projects = getState().projects;
          const project = projects[projectID];
          const sections = project.sections;
          const section = sections[sectionID];
          const entries = {
            ...section.entries
          };
          delete entries[entryID];
          dispatch(
            update({
              projects: {
                ...projects,
                ...{
                  [projectID]: {
                    ...project,
                    ...{
                      sections: {
                        ...sections,
                        ...{ [sectionID]: { ...section, ...{ entries } } }
                      }
                    }
                  }
                }
              }
            })
          );
        } catch (e) {
          console.log(e);
        }
      });
  };
}
