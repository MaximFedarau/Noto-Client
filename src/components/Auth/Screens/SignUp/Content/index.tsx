import React, { FC } from 'react';

import ContentScrollView from '@components/Auth/Default/ContentScrollView';
import Logo from '@components/Auth/Default/Logo';
import Form from '@components/Auth/Screens/SignUp/Form';

const Content: FC = () => (
  <ContentScrollView>
    <Logo />
    <Form />
  </ContentScrollView>
);

export default Content;
