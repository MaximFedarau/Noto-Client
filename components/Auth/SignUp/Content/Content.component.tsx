//Types
import React, { ReactElement } from 'react';

//Components
import LogoPicker from '@components/Auth/SignUp/LogoPicker/LogoPicker.component';
import Form from '@components/Auth/SignUp/Form/Form.component';

import { DefaultScrollView } from '@components/Default/View/View.component';

export default function Content(): ReactElement {
  const [image, setImage] = React.useState<undefined | string>(undefined); // because variable exists, but it is has no value
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
      <LogoPicker image={image} setImage={setImage} />
      <Form image={image} />
    </DefaultScrollView>
  );
}
