//Types
import { ReactElement } from 'react';

//Components
import ContentScrollView from '@components/Auth/Defaults/ContentScrollView/ContentScrollView.component';
import Logo from '@components/Auth/Defaults/Logo/Logo.component';
import Form from '@components/Auth/Screens/SignUp/Form/Form.component';

export default function Content(): ReactElement {
  return (
    <ContentScrollView>
      <Logo />
      <Form />
    </ContentScrollView>
  );
}
