import React, { FC } from 'react';
import { TextInputProps } from 'react-native';

import { AuthInput } from '@components/Default/Input/Input.component';
import { FormErrorText } from '@components/Default/Text/Text.component';

interface Props extends TextInputProps {
  children: string;
  error?: string;
}

const FormField: FC<Props> = ({ children, error, ...props }) => (
  <>
    <AuthInput value={children} {...props} />
    {error && <FormErrorText>{error}</FormErrorText>}
  </>
);

export default FormField;
