//Types
import { ReactElement } from 'react';
import { TextInputAndroidProps } from 'react-native';

//Components
import { View } from 'react-native';
import { SearchBarInput } from './SearchBar.styles';

//React Native
import { useWindowDimensions } from 'react-native';

export default function SearchBar(props: TextInputAndroidProps): ReactElement {
  const { width } = useWindowDimensions();
  return (
    <View
      style={{
        width: width > 600 ? 500 : 240,
        height: 40,
        alignSelf: 'center',
      }}
    >
      <SearchBarInput {...props} />
    </View>
  );
}
