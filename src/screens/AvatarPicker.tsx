import React, { FC } from 'react';

import { AuthScreenContainer } from '@components/Default/View/View.component';
import Content from '@components/Auth/Screens/AvatarPicker/Content/Content.component';

export const AvatarPicker: FC = () => {
  return (
    <AuthScreenContainer>
      <Content />
    </AuthScreenContainer>
  );
};
