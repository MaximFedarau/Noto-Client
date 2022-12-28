import React, { FC } from 'react';
import { TextInputProps, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SearchBarInput } from '@components/Default';
import { SIZES } from '@constants';

export const SearchBar: FC<TextInputProps> = (props) => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        width:
          width -
          SIZES['4xl'] * 2 -
          SIZES['2xl'] * 2 - // SIZES['2xl'] * 2 for padding on both sides
          insets.left -
          insets.right,
        alignSelf: 'center',
        height: SIZES['5xl'],
      }}
    >
      <SearchBarInput {...props} autoCapitalize="none" />
    </View>
  );
};
