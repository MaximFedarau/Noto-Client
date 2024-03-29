import React, { FC } from 'react';
import { ActivityIndicator } from 'react-native';

import { FormButtonsContainer } from '@components/Default/View';

export const Spinner: FC = () => (
  <FormButtonsContainer>
    <ActivityIndicator size="large" />
  </FormButtonsContainer>
);
