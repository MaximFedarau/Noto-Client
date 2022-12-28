import styled from 'styled-components/native';

export const Container = styled.Pressable`
  margin: ${({ theme }) => theme.sizes.lg}px;
  background-color: ${({ theme }) => theme.colors.white};
  border-color: ${({ theme }) => theme.colors.black};
  border-width: 2px;
  border-radius: ${({ theme }) => theme.sizes.sm}px;
  max-height: 696px;
  min-height: ${({ theme }) => theme.sizes['22xl']}px;
  overflow: hidden;
  padding: ${({ theme }) => theme.sizes.lg}px;
`;
