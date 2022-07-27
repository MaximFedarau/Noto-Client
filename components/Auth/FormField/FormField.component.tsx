//Types
import { ReactElement } from 'react';
import { TextInputProps } from 'react-native';

//Components
import { AuthInput } from '@components/Default/Input/Input.component';
import { AuthFormErrorText } from '@components/Default/Text/Text.component';

//React Native
import { Platform } from 'react-native';

//Interface for Props
interface FormFieldProps extends TextInputProps {
  children: string;
  error?: string;
  forceErrorShowing?: boolean;
}

export default function FormField({
  children,
  error,
  forceErrorShowing,
  ...props
}: FormFieldProps): ReactElement {
  const formSelectionColor = {
    ...(Platform.OS === 'ios' && { selectionColor: 'black' }),
  };
  return (
    <>
      <AuthInput value={children} {...props} {...formSelectionColor} />
      {forceErrorShowing
        ? error && <AuthFormErrorText>{error}</AuthFormErrorText>
        : error && !children && <AuthFormErrorText>{error}</AuthFormErrorText>}
      {/* Statement above means, that is forceErrorShowing is true, then we check if error exists and then show this error.
      Else we show error only if error exists and input is not empty. */}
    </>
  );
}
