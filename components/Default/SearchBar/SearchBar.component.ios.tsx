//Types
import { ReactElement } from 'react';
import { TextInputIOSProps } from 'react-native';

//Components
import { View } from 'react-native';
import { SearchBarInput } from './SearchBar.styles';

//React Native
import { useWindowDimensions } from 'react-native';

export default function SearchBar(props: TextInputIOSProps): ReactElement {
  const { width } = useWindowDimensions();
  return (
    <View
      style={{
        width: width > 600 ? 500 : 240,
        height: 40,
        alignSelf: 'center',
        marginTop: 8,
      }}
    >
      <SearchBarInput selectionColor="black" {...props} />
    </View>
  );
}
