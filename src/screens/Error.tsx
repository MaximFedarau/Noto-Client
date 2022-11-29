import React, { FC } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { ErrorView } from '@components/Default/View/View.component';

export const Error: FC = () => (
  <>
    <StatusBar style="dark" />
    <ErrorView>
      <Ionicons name="ios-alert" size={100} color="red" />
    </ErrorView>
  </>
);
