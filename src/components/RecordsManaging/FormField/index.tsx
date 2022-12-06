import React, { FC } from 'react';
import { TextInputProps } from 'react-native';
import { IconNode, Input } from '@rneui/base';

import { styles } from './styles';

interface Props extends TextInputProps {
  children?: string;
  errorMessage?: string;
  leftIcon?: IconNode;
}

const FormField: FC<Props> = ({ children, errorMessage, ...props }) => (
  <Input
    {...props}
    label={children}
    labelStyle={styles.label}
    errorStyle={styles.error}
    errorMessage={errorMessage}
    containerStyle={styles.container}
    inputStyle={styles.input}
  />
);

export default FormField;
