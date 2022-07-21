//Types
import { ReactElement } from 'react';

//Components
import Form from '@components/SignIn/Form/Form.component';

import { Logo } from './Content.styles';

//React Native
import { ScrollView } from 'react-native';

export default function Content(): ReactElement {
  return (
    <ScrollView
      style={{ flex: 1 }}
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
    </ScrollView>
  );
}
