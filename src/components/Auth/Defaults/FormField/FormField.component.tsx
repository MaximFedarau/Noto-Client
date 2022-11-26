import { ReactElement } from 'react';
import { TextInputProps, Platform } from 'react-native';

import { AuthInput } from '@components/Default/Input/Input.component';
import { AuthFormErrorText } from '@components/Default/Text/Text.component';

//Interface for Props
interface FormFieldProps extends TextInputProps {
  children: string;
  error?: string;
}

export default function FormField({
  children,
  error,
  ...props
}: FormFieldProps): ReactElement {
  const formSelectionColor = {
    ...(Platform.OS === 'ios' && { selectionColor: 'black' }),
  };
  return (
    <>
      <AuthInput value={children} {...props} {...formSelectionColor} />
      {error && <AuthFormErrorText>{error}</AuthFormErrorText>}
      {/* Statement above means, that if forceErrorShowing is true, then we check existence of an error and then show this error.
      Else, we show error only if error exists and input is not empty. */}
    </>
  );
}
