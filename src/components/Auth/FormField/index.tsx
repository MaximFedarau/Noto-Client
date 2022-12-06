import React, { FC } from 'react';
import { TextInputProps } from 'react-native';

import { AuthInput } from '@components/Default/Input';
import { FormErrorText } from '@components/Default/Text';

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
