'use client';

import * as RadixDialog from '@radix-ui/react-dialog';
import { ReactNode } from 'react';

export function Dialog({ open, onOpenChange, children }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-40" />
        {children}
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}

export function DialogContent({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <RadixDialog.Content
      className={`fixed z-50 bg-white rounded-xl shadow-lg p-6 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${className}`}
    >
      {children}
    </RadixDialog.Content>
  );
}

export function DialogHeader({ children }: { children: ReactNode }) {
  return <div className="mb-4">{children}</div>;
}

export function DialogTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-lg font-semibold text-gray-800">{children}</h2>;
}
