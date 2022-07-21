//Types
import { ReactElement } from 'react';

//React Native
import {
  ScrollView,
  Image,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';

export default function Auth(): ReactElement {
  return (
    <SafeAreaView
      style={{
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      }}
    >
      <ScrollView bounces={false}>
        <Image
          style={{
            width: 120,
            height: 176,
            alignSelf: 'center',
          }}
          source={require('@assets/images/noto-plus.png')}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
