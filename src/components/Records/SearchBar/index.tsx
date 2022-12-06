import React, { FC } from 'react';
import { TextInputProps, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SearchBarInput } from '@components/Default/Input';
import { sizes } from '@constants/sizes';

const SearchBar: FC<TextInputProps> = (props) => {
  const { width } = useWindowDimensions();
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
      <SearchBarInput {...props} autoCapitalize="none" />
    </View>
  );
};

export default SearchBar;
