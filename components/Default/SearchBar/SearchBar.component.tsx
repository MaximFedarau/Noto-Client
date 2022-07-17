//Types
import { ReactElement } from 'react';
import { TextInputIOSProps } from 'react-native';

//Components
import { View } from 'react-native';
import { SearchBarInput } from './SearchBar.styles';

//React Native
import { useWindowDimensions, Platform } from 'react-native';

export default function SearchBar(props: TextInputIOSProps): ReactElement {
  const { width } = useWindowDimensions();
  const { OS } = Platform;
  return (
    <View
      style={{
        width: width > 600 ? 500 : 240,
        height: 40,
        alignSelf: 'center',
        marginTop: OS === 'ios' ? 8 : 0,
      }}
    >
      <SearchBarInput
        {...(OS === 'ios' && { selectionColor: 'black' })}
        {...props}
      />
    </View>
  );
}
