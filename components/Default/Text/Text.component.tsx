//Styled componets
import styled from 'styled-components/native';

//Constants
import { OSLO_GRAY } from '../../../constants/colors';

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
`;
