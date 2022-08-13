import React, { ReactElement } from 'react';
import Toast from 'react-native-toast-message';

import Form from '@components/NotesManaging/Form/Form.component';
import { DefaultSafeAreaView } from '@components/Default/View/View.component';

export default function NotesManaging(): ReactElement {
  return (
    <DefaultSafeAreaView>
      <Form />
      <Toast />
    </DefaultSafeAreaView>
  );
}
