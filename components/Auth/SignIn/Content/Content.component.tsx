//Types
import { ReactElement } from 'react';

//Components
import Form from '@components/Auth/SignIn/Form/Form.component';

import { Logo } from './Content.styles';
import { DefaultScrollView } from '@components/Default/View/View.component';

export default function Content(): ReactElement {
  return (
    <DefaultScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '16%',
      }}
      bounces={false}
    >
      <Logo source={require('@assets/images/noto-plus.png')} />
      <Form />
    </DefaultScrollView>
  );
}
