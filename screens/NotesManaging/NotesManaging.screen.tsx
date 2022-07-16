//Types
import React, { ReactElement } from 'react';

//Components
import Form from '@components/NotesManaging/Form/Form.component';
import { DefaultSafeAreaView } from '@components/Default/View/View.component';

export default function NotesManaging(): ReactElement {
  return (
    <DefaultSafeAreaView>
      <Form />
    </DefaultSafeAreaView>
  );
}
