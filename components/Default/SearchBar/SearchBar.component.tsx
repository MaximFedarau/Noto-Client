import { ReactElement } from 'react';
import {
  TextInputProps,
  View,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { sizes } from '@constants/sizes';

import { SearchBarInput } from './SearchBar.styles';

export default function SearchBar(props: TextInputProps): ReactElement {
  const { width } = useWindowDimensions();
  const { OS } = Platform;
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        width:
          width -
          sizes.SIDE_ICON_SIZE * 2 -
          24 * 2 - // 24px * 2 for padding on both sides
          insets.left -
          insets.right,
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
