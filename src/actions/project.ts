import { Dispatch, Action } from 'redux';
import slugify from 'slugify';
import firebase from '../lib/firebase';
import history from '../lib/history';
import { update } from './index';
import { State, Project, Section } from '../types';

const db = firebase.firestore();

export function createProject(name: string, parentProject?: string) {
  return function(dispatch: Dispatch<Action>, getState: () => State) {
    dispatch(update({ modalLoading: true }));
    const id = slugify(name.toLowerCase());

    const ref = parentProject
      ? db
          .collection('projects')
          .doc(parentProject)
          .collection('sections')
          .doc(id)
      : db.collection('projects').doc(id);

    ref
      .get()
      .then(res => {
        if (res.exists) {
          const modalMessage = `${
            !parentProject ? 'Project' : 'Section'
          } with same name already exists${parentProject &&
            ' under this project'}`;
          dispatch(
            update({
              modalMessage,
              modalLoading: false
            })
          );
        } else {
          ref
            .set({
              name
            })
            .then(() => {
              dispatch(
                update({
                  modalMessage: '',
                  showModal: false,
                  modalLoading: false
                })
              );
              if (parentProject) {
                history.push(`/project/${parentProject}/${id}`);
              } else {
                history.push('/project/' + id);
              }
            })
            .catch(error => {
              dispatch(
                update({
                  modalMessage:
                    `Couldn't save ${
                      !parentProject ? 'project' : 'section'
                    }. ` + error.message,
                  modalLoading: false
                })
              );
            });
        }
      })
      .catch(error => {
        dispatch(
          update({
            modalMessage:
              `Couldn't save project. ${
                !parentProject ? 'project' : 'section'
              }.` + error.message,
            modalLoading: false
          })
        );
      });
  };
}

export function loadProject(projectID: string) {
  return function(dispatch: Dispatch<Action>, getState: () => State) {
    const { projects } = getState();
    dispatch(update({ pMessage: '' }));
    db
      .collection('projects')
      .doc(projectID)
      .get()
      .then(res => {
        if (res.exists) {
          dispatch(
            update({
              projects: {
                ...projects,
                ...{ [projectID]: res.data() as Project }
              }
            })
          );
        } else {
          dispatch(
            update({
              pMessage: "Project doesn't exits"
            })
          );
        }
      })
      .catch(error => {
        dispatch(
          update({
            pMessage: "Couldn't load project. " + error.message
          })
        );
      });
  };
}

export function loadSection(id: string, parentID: string) {
  return async function(dispatch: Dispatch<Action>, getState: () => State) {
    dispatch(pMessage(''));

    const { projects } = getState();
    let project = projects[parentID];

    const projectRef = db.collection('projects').doc(parentID);

    if (!project) {
      try {
        const projectData = await projectRef.get();
        if (!projectData.exists) {
          dispatch(pMessage("Project doesn't exits"));
          return;
        } else {
          project = projectData.data() as Project;
        }
      } catch (e) {
        dispatch(pMessage("Couldn't load section"));
        return;
      }
    }

    projectRef
      .collection('sections')
      .doc(id)
      .get()
      .then(res => {
        if (!res.exists) {
          dispatch(pMessage("Project or section doesn't exits"));
          return;
        }
        const updates = {
          projects: {
            ...projects,
            ...{
              [parentID]: {
                ...project,
                ...{
                  sections: {
                    ...project.sections,
                    ...{ [id]: res.data() as Section }
                  }
                }
              }
            }
          }
        };
        dispatch(update(updates));
      })
      .catch(error => {
        dispatch(pMessage("Couldn't load section. " + error.message));
      });
  };
}

function pMessage(message: string) {
  return update({ pMessage: message });
}
