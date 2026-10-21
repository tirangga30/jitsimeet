import React, { type ButtonHTMLAttributes } from "react";
import { Icon, StyledButton, Spinner } from "./Button.styles";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  src?: string;
  hasIcon?: boolean;
  color?: string;
  bgcolor: string;
  iconWidth?: number;
  iconHeight?: number;
  border?: string;
  padding?: string;
  width?: string;
  textDecoration?: string;
  hoverBg?: string;
  iconAfterText?: boolean;
  hoverBorder?: string;
  isLoading?: boolean;
  margin?: string;
}

const Button = ({
  children,
  src,
  hasIcon,
  bgcolor,
  color,
  iconHeight,
  iconWidth,
  border,
  padding,
  width,
  textDecoration,
  hoverBg,
  iconAfterText,
  hoverBorder,
  isLoading,
  margin,
  ...rest
}: Props) => {
  return (
    <StyledButton
      bgcolor={bgcolor}
      color={color ?? "#FFFFFF"}
      border={border ?? "none"}
      padding={padding ?? "15px"}
      textDecoration={textDecoration ?? "none"}
      width={width ?? ""}
      $hoverBg={hoverBg}
      margin={margin}
      $hoverBorder={hoverBorder}
      disabled={isLoading || rest.disabled}
      {...rest}
    >
      {isLoading && <Spinner color={color ?? "#FFFFFF"} />}
      {!isLoading && !iconAfterText && hasIcon && src && (
        <Icon
          src={src}
          alt={children?.toString()}
          width={iconWidth ?? 16}
          height={iconHeight ?? 16}
        />
      )}
      {children}
      {!isLoading && iconAfterText && hasIcon && src && (
        <Icon
          src={src}
          alt={children?.toString()}
          width={iconWidth ?? 16}
          height={iconHeight ?? 16}
        />
      )}
    </StyledButton>
  );
};

export default Button;
