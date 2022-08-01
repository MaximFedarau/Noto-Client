import { ReactElement } from 'react';
import {
  TextInputProps,
  View,
  useWindowDimensions,
  Platform,
} from 'react-native';

import { SearchBarInput } from './SearchBar.styles';

export default function SearchBar(props: TextInputProps): ReactElement {
  const { width } = useWindowDimensions();
  const { OS } = Platform;
  return (
    <View
      style={{
        width: width > 600 ? 500 : 240,
        height: 40,
        alignSelf: 'center',
        marginTop: OS === 'ios' && width > 600 ? 4 : 0,
      }}
    >
      <SearchBarInput
        {...props}
        {...(OS === 'ios' && { selectionColor: 'black' })}
      />
    </View>
  );
}
