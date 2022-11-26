import styled from 'styled-components/native';

import Button from '@components/Default/Button/Button.component';
import IconButton from '@components/Default/IconButton/IconButton.component';
import { SOFT_BLUE } from '@constants/colors';

export const FormSubmitButton = styled(Button)`
  background-color: ${SOFT_BLUE};
  border: none;
  min-width: 50%;
  height: 40px;
`;

export const HomeButton = styled(IconButton)`
  background-color: ${SOFT_BLUE};
  border-radius: 24px;
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
`;
