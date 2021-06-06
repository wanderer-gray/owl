import { SnackbarProvider } from 'notistack';
import NotifyStore from './store';
import NotifyView from './view';

const Notify = ({ children }) => {
  const notifyStore = new NotifyStore();

  return (
    <SnackbarProvider
      hideIconVariant={true}
      autoHideDuration={3000}
    >
      <NotifyView NotifyStore={notifyStore} >
        {children}
      </NotifyView>
    </SnackbarProvider>
  );
};

export default Notify;
