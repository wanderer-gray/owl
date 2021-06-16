import AccountsStore from './store';
import AccountEditStore from './account/edit';
import AccountCreateStore from './account/create';
import View from './view';

const Conditions = () => {
  const accounts = new AccountsStore();
  const accountEdit = new AccountEditStore({ AccountsStore: accounts });
  const accountCreate = new AccountCreateStore({ AccountsStore: accounts });

  return (
    <View
      AccountsStore={accounts}
      AccountEditStore={accountEdit}
      AccountCreateStore={accountCreate}
    />
  );
};

export default Conditions;
