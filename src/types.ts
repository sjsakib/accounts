export interface User {
  name: string;
  uid: string;
  photoURL: string;
}

export interface Project {
  name: string;
}

export interface State {
  showModal: boolean;
  modalLoading: boolean;
  modalMessage: string;
  authenticating: boolean;
  pMessage?: string;
  user?: User;
  projects: {
    [key: string]: Project;
  };
}
