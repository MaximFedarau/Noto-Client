import React, { FC } from 'react';
import { TextInputProps } from 'react-native';

import { AuthInput, FormErrorText } from '@components/Default';

interface Props extends TextInputProps {
  children: string;
  error?: string;
}

export const AuthFormField: FC<Props> = ({ children, error, ...props }) => (
  <>
    <AuthInput value={children} {...props} />
    {error && <FormErrorText>{error}</FormErrorText>}
  </>
);
