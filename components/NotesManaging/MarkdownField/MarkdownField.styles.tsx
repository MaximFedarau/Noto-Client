import styled from 'styled-components/native';

import { BUNTING } from '@constants/colors';

//Interface for TabContainer
interface TabProps {
  isActive?: boolean;
}

export const MarkdownFieldContainer = styled.View`
  flex: 1;
  flex-direction: row;
  margin-horizontal: 8px;
  border-bottom-color: ${BUNTING};
  border-bottom-width: 1px;
  justify-content: space-between;
`;

export const TabContainer = styled.Pressable<TabProps>`
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

export const TabText = styled.Text<TabProps>`
  color: ${({ isActive }) => (isActive ? 'white' : BUNTING)};
  font-size: 17px;
`;

export const MarkdownContainer = styled.View`
  flex: 1;
  margin-bottom: 48px;
  margin-horizontal: 8px;
`;
