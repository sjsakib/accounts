import * as React from 'react';
import { connect } from 'react-redux';
import Decorator from './Decorator';
import { State } from '../types';
import { update } from '../actions';
import { Button } from 'semantic-ui-react';
import CreateProject from './CreateProject';

class Home extends React.Component<HomeProps> {
  render() {
    const { dispatch } = this.props;
    return (
      <Decorator title="Prodhan's Trading Accounts">
        <Button
          circular
          icon="add circle"
          onClick={() => dispatch(update({ showModal: true }))}
        />
        <CreateProject />
      </Decorator>
    );
  }
}

interface HomeProps {
  showModal: boolean;
  dispatch: (action: any) => void;
}

const mapStateToProps = ({ showModal }: State) => ({
  showModal
});

export default connect(mapStateToProps)(Home);
