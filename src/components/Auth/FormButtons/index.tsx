import React, { FC } from 'react';

import { FormButtonsContainer } from '@components/Default';
import { SIZES, COLORS } from '@constants';

import { FormSubmitButton, HomeButton, styles } from './styles';

interface Props {
  children: string;
  onSubmit: () => void;
  onHomeReturn: () => void;
}

export const FormButtons: FC<Props> = ({
  children,
  onSubmit,
  onHomeReturn,
}) => (
  <FormButtonsContainer>
    <FormSubmitButton onPress={onSubmit} textStyle={styles.buttonText}>
      {children}
    </FormSubmitButton>
    <HomeButton
      iconName="home"
      color={COLORS.white}
      size={SIZES['2xl']}
      onPress={onHomeReturn}
    />
  </FormButtonsContainer>
);
