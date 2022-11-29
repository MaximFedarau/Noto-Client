import React, { FC } from 'react';

import Form from '@components/NotesManaging/Form/Form.component';
import { DefaultSafeAreaView } from '@components/Default/View/View.component';

export const NotesManaging: FC = () => (
  <DefaultSafeAreaView>
    <Form />
  </DefaultSafeAreaView>
);
