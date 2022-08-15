import { ReactElement } from 'react';
import {
  TextInputProps,
  View,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SearchBarInput } from './SearchBar.styles';

export default function SearchBar(props: TextInputProps): ReactElement {
  const { width } = useWindowDimensions();
  const { OS } = Platform;
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        width: width - 112 - insets.left - insets.right,
        alignSelf: 'center',
        height: 36,
      }}
    >
      <SearchBarInput
        {...props}
        {...(OS === 'ios' && { selectionColor: 'black' })}
        autoCapitalize="none"
      />
    </View>
  );
}
