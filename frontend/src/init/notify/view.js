import { Component } from 'react';
import { autorun } from 'mobx';
import { observer } from 'mobx-react';
import { withSnackbar } from 'notistack';

class NotifyView extends Component {
  componentDidMount() {
    autorun(() => {
      const { notifications, clear } = this.props.NotifyStore;

      if (!notifications.length) {
        return;
      }

      notifications.forEach(({ message, ...options }) => {
        this.props.enqueueSnackbar(message, options);
      });

      clear();
    });
  }

  render() {
    const { children } = this.props;

    return children;
  }
}

export default withSnackbar(observer(NotifyView));
