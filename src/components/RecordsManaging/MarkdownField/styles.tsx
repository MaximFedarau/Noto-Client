import styled from 'styled-components/native';

import { Container } from '@components/Default/View';
import { DefaultText } from '@components/Default/Text';
import { BUNTING } from '@constants/colors';

interface Props {
  isActive?: boolean;
}

export const MarkdownFieldContainer = styled(Container)`
  flex: none;
  flex-direction: row;
  margin-horizontal: 8px;
  border-bottom-color: ${BUNTING};
  border-bottom-width: 1px;
`;

export const FieldContainer = styled(Container)`
  flex: 1;
`;

export const MarkdownContainer = styled(Container)`
  flex: 1;
  margin-bottom: 48px;
  margin-horizontal: 8px;
`;

export const TabText = styled(DefaultText)<Props>`
  color: ${({ isActive }) => (isActive ? 'white' : BUNTING)};
  font-size: 17px;
`;

export const TabContainer = styled.Pressable<Props>`
  height: 40px;
  width: 50%;
  align-items: center;
  justify-content: center;
  padding-horizontal: 8px;
  padding-vertical: 8px;
  background-color: ${({ isActive }) => (isActive ? BUNTING : 'transparent')};
  border-top-end-radius: 5px;
  border-top-start-radius: 5px;
`;
