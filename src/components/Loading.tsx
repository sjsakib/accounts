import * as React from 'react';
import { Icon } from 'semantic-ui-react';

export default function() {
  return (
    <div className="main-loader-container">
      <Icon className="main-loader" loading name="spinner" size="large" />
    </div>
  );
}
