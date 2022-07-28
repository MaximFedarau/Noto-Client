//Types
import { ReactElement } from 'react';

//Components
import { LogoImage } from './Logo.styles';

export default function Logo(): ReactElement {
  return <LogoImage source={require('@assets/images/noto-plus.png')} />;
}
