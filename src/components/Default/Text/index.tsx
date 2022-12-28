import styled from 'styled-components/native';
import { HeaderTitle } from '@react-navigation/elements';

export const DefaultText = styled.Text`
  color: ${({ theme }) => theme.colors.black};
  font-size: ${({ theme }) => theme.fonts.sizes.base}px;
`;

export const NoItemsText = styled(DefaultText)`
  color: ${({ theme }) => theme.colors.osloGray};
  font-size: ${({ theme }) => theme.fonts.sizes.xl}px;
  text-transform: uppercase;
  align-self: center;
`;

export const RecordTitle = styled(DefaultText)`
  text-align: center;
  font-size: ${({ theme }) => theme.fonts.sizes['2xl']}px;
  font-weight: bold;
`;

export const RecordsHeaderTitle = styled(HeaderTitle)`
  font-family: ${({ theme }) => theme.fonts.families.primary};
`;

export const FormErrorText = styled(DefaultText)`
  align-self: flex-start;
  color: ${({ theme }) => theme.colors.red};
  font-size: ${({ theme }) => theme.fonts.sizes.sm}px;
  margin-horizontal: ${({ theme }) => theme.sizes.md}px;
  margin-bottom: ${({ theme }) => theme.sizes.md}px;
`;

export const NavigationText = styled(DefaultText)`
  font-weight: bold;
`;
