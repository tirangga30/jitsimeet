import { type InputHTMLAttributes } from 'react';
import { StyledInput } from './Input.styles';

type Props = InputHTMLAttributes<HTMLInputElement>;

const Input = (props: Props) => {
  return <StyledInput {...props} />;
};

export default Input;
