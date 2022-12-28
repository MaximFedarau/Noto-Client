import styled from 'styled-components/native';

import { Container, DefaultText } from '@components/Default';

interface Props {
  isActive?: boolean;
}

export const MarkdownFieldContainer = styled(Container)`
  flex: none;
  flex-direction: row;
  margin-horizontal: ${({ theme }) => theme.sizes.sm}px;
  border-bottom-color: ${({ theme }) => theme.colors.bunting};
  border-bottom-width: 1px;
`;

export const FieldContainer = styled(Container)`
  flex: 1;
`;

export const MarkdownContainer = styled(Container)`
  flex: 1;
  margin-bottom: ${({ theme }) => theme.sizes['8xl']}px;
  margin-horizontal: ${({ theme }) => theme.sizes.sm}px;
`;

export const TabText = styled(DefaultText)<Props>`
  color: ${({ isActive, theme }) =>
    isActive ? theme.colors.white : theme.colors.bunting};
  font-size: ${({ theme }) => theme.fonts.sizes.lg}px;
`;

export const TabContainer = styled.Pressable<Props>`
  height: ${({ theme }) => theme.sizes['7xl']}px;
  width: 50%;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.sizes.sm}px;
  background-color: ${({ isActive, theme }) =>
    isActive ? theme.colors.bunting : 'transparent'};
  border-top-end-radius: ${({ theme }) => theme.sizes.sm / 2}px;
  border-top-start-radius: ${({ theme }) => theme.sizes.sm / 2}px;
`;
