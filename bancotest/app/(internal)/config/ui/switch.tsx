import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
}

export default function Switch({ checked = false, onCheckedChange, disabled = false, label }: SwitchProps) {
  const [internalChecked, setInternalChecked] = useState(checked);
  const isControlled = onCheckedChange !== undefined;

  useEffect(() => {
    if (isControlled) {
      setInternalChecked(checked);
    }
  }, [checked, isControlled]);

  const handleToggle = () => {
    if (disabled) return;

    const newChecked = !internalChecked;
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    onCheckedChange?.(newChecked);
  };

  const isActive = isControlled ? checked : internalChecked;

  return (
    <div className="flex items-center justify-between gap-4 py-2">
      {label && <span className="text-sm text-gray-700 font-medium whitespace-nowrap">{label}</span>}
      <button
        onClick={handleToggle}
        disabled={disabled}
        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300
          ${isActive ? 'bg-green-500' : 'bg-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <motion.div
          layout
          className="w-4 h-4 bg-white rounded-full shadow-md"
          initial={false}
          animate={{ x: isActive ? 24 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
}