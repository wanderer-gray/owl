import { Component } from 'react';
import { inject } from 'mobx-react';

import TestEditStore from '../shared/store/edit';
import QuestionEditStore from '../shared/store/question/edit';

import SharedStore from './shared';

import ContactsStore from './shared/contacts';
import ContactEditStore from './shared/contact/edit';
import ContactCreateStore from './shared/contact/create';

import GroupsStore from './shared/groups';
import GroupEditStore from './shared/group/edit';
import GroupCreateStore from './shared/group/create';

import DecisionsStore from './decisions';
import DecisionEditStore from './decisions/decision/edit';
import DecisionCreateStore from './decisions/decision/create';

import View from '../shared/view/edit';

class EditTest extends Component {
  constructor(props) {
    super(props);

    const {
      match,
      AuthStore
    } = this.props;

    const testEditStore = new TestEditStore(match.params.id);

    this.TestEditStore = testEditStore;
    this.QuestionEditStore = new QuestionEditStore({ TestStore: testEditStore });

    const sharedStore = new SharedStore({ TestStore: testEditStore });

    this.SharedStore = sharedStore;

    this.ContactsStore = new ContactsStore({ SharedStore: sharedStore, AuthStore });
    this.ContactEditStore = new ContactEditStore({ SharedStore: sharedStore });
    this.ContactCreateStore = new ContactCreateStore({ SharedStore: sharedStore });

    this.GroupsStore = new GroupsStore({ SharedStore: sharedStore, AuthStore });
    this.GroupEditStore = new GroupEditStore({ SharedStore: sharedStore });
    this.GroupCreateStore = new GroupCreateStore({ SharedStore: sharedStore });

    const decisionsStore = new DecisionsStore({ TestStore: testEditStore });

    this.DecisionsStore = decisionsStore;

    this.DecisionEditStore = new DecisionEditStore({ DecisionsStore: decisionsStore });
    this.DecisionCreateStore = new DecisionCreateStore({ DecisionsStore: decisionsStore });
  }

  componentWillUnmount() {
    this.ContactsStore.dispose();
    this.GroupsStore.dispose();
  }

  render() {
    return (
      <View
        TestStore={this.TestEditStore}
        QuestionEditStore={this.QuestionEditStore}
        
        SharedStore={this.SharedStore}

        ContactsStore={this.ContactsStore}
        ContactEditStore={this.ContactEditStore}
        ContactCreateStore={this.ContactCreateStore}

        GroupsStore={this.GroupsStore}
        GroupEditStore={this.GroupEditStore}
        GroupCreateStore={this.GroupCreateStore}

        DecisionsStore={this.DecisionsStore}
        DecisionEditStore={this.DecisionEditStore}
        DecisionCreateStore={this.DecisionCreateStore}
      />
    );
  }
}

export default inject(
  ({ AuthStore }) => { 
    return {
      AuthStore,
    };
  }
)(EditTest);
