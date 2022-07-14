//Types
import { ReactElement } from 'react';

//Expo
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

//Components
import { ErrorView } from '@components/Default/View/View.component';

export default function Error(): ReactElement {
  return (
    <>
      <StatusBar style="dark" />
      <ErrorView>
        <Ionicons name="ios-alert" size={100} color="red" />
      </ErrorView>
    </>
  );
}
