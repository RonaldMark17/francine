import { createPortal } from 'react-dom';

export default function ModalOverlay({ children, className = '', ...props }) {
  return createPortal(
    <div {...props} className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-fade-in ${className}`}>
      {children}
    </div>,
    document.body,
  );
}
