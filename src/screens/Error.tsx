import React, { FC } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { ErrorContainer } from '@components/Default/View';

export const Error: FC = () => (
  <>
    <StatusBar style="dark" />
    <ErrorContainer>
      <Ionicons name="ios-alert" size={100} color="red" />
    </ErrorContainer>
  </>
);
