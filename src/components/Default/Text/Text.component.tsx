import styled from 'styled-components/native';
import { HeaderTitle } from '@react-navigation/elements';

import { OSLO_GRAY } from '@constants/colors';

// ! Default

export const DefaultText = styled.Text`
  color: black;
  font-size: 16px;
`;

export const NoItemsText = styled(DefaultText)`
  color: ${OSLO_GRAY};
  font-size: 20px;
  text-transform: uppercase;
  align-self: center;
`;

// ! Records

export const RecordTitle = styled(DefaultText)`
  text-align: center;
  font-size: 22px;
  font-weight: bold;
`;

// ! Auth Screens

export const FormErrorText = styled(DefaultText)`
  color: red;
  font-size: 14px;
  margin-horizontal: 12px;
  margin-bottom: 12px;
`;

export const NavigationText = styled(DefaultText)`
  font-size: 16px;
  font-weight: bold;
  text-align: center;
`;

// ! Notes & Drafts screens

export const RecordsHeaderTitle = styled(HeaderTitle)`
  font-family: Roboto-Regular;
`;
