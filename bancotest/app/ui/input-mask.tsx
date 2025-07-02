import React, { forwardRef } from 'react';
import InputMask from 'react-input-mask';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  mask: string;
};

const InputMaskField = forwardRef<HTMLInputElement, Props>(
  ({ mask, className = '', ...props }, ref) => {
    return (
      <InputMask
        {...props}
        mask={mask}
        className={`w-full placeholder-gray-500 text-gray-700 p-2 border border-gray-300 rounded-md ${className}`}
        // @ts-ignore
        ref={ref}
      />
    );
  }
);

InputMaskField.displayName = 'InputMaskField';
export default InputMaskField;