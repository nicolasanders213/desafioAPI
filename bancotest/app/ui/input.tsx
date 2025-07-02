import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    appendIcon?: IconDefinition;
    containerClassName?: string;
}

export default function Input({ containerClassName, className, appendIcon, ...props}: InputProps) {
    const extraPaddingIfIcon = appendIcon ? 'pr-3' : ''
    
    return (
        <div className={`border border-gray-400 shadow-lg rounded-md py-1 px-2 min-w-64 text-xs relative ${containerClassName}`}>
            <input {...props} className={`placeholder-gray-500 w-full h-full ${extraPaddingIfIcon} ${className} outline-none`} />

            {appendIcon && 
                <FontAwesomeIcon icon={appendIcon} 
                    className="pointer-events-none absolute right-2 top-0 translate-y-1/2 w-3" />}
        </div>
    )
}