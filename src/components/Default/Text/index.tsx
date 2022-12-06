import styled from 'styled-components/native';
import { HeaderTitle } from '@react-navigation/elements';

import { OSLO_GRAY } from '@constants/colors';

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

export const RecordTitle = styled(DefaultText)`
  text-align: center;
  font-size: 22px;
  font-weight: bold;
`;

export const RecordsHeaderTitle = styled(HeaderTitle)`
  font-family: Roboto-Regular;
`;

export const FormErrorText = styled(DefaultText)`
  align-self: flex-start;
  color: red;
  font-size: 14px;
  margin-horizontal: 12px;
  margin-bottom: 12px;
`;

export const NavigationText = styled(DefaultText)`
  font-weight: bold;
`;
