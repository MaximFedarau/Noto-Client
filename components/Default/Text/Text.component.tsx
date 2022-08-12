import styled from 'styled-components/native';

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
  font-family: 'Roboto-Regular';
  align-self: center;
`;

// ! Drafts
export const DraftTitle = styled(DefaultText)`
  text-align: center;
  font-size: 22px;
  font-weight: bold;
`;

export const NoDraftText = styled(DefaultText)`
  text-align: center;
  font-size: 22px;
  align-self: center;
`;

// ! Auth Screens

export const AuthFormErrorText = styled(DefaultText)`
  color: red;
  font-size: 14px;
  margin-horizontal: 12px;
  margin-bottom: 12px;
`;

export const AuthNavigationText = styled(DefaultText)`
  font-size: 16px;
  font-weight: bold;
  text-align: center;
`;
