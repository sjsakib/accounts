export interface User {
  name: string;
  uid: string;
  photoURL: string;
}

export interface State {
  showModal: boolean;
  modalLoading: boolean;
  modalMessage: string;
  authenticating: boolean;
  user?: User;
}
