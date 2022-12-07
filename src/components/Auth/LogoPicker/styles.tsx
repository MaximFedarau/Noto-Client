import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';

import { SIZES } from '@constants';

export const styles = StyleSheet.create({
  button: {
    width: SIZES['28xl'] * 2,
    height: SIZES['28xl'] * 2,
    borderRadius: SIZES['28xl'],
    overflow: 'hidden',
  },
});

export const PickedImage = styled.Image`
  width: 100%;
  height: 100%;
`;
