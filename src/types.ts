export interface State {
  authenticating: boolean;
  user?: { name: string; uid: string; photoURL: string };
}
