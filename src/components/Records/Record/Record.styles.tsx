import styled from 'styled-components/native';

import { sizes } from '@constants/sizes';

export const Container = styled.Pressable`
  margin-vertical: 16px;
  background-color: white;
  margin-horizontal: 18px;
  border-color: black;
  border-width: 2px;
  border-radius: 8px;
  max-height: 696px;
  min-height: ${sizes.NOTES_LIST_MINIMUM_ITEM_SIZE}px;
  overflow: hidden;
  padding-horizontal: 16px;
  padding-vertical: 16px;
`;
