import { useEffect, useRef } from 'react';

let scrollLocks = 0;
let previousOverflow = '';
const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Keep keyboard focus and scrolling inside an open modal, then restore the trigger. */
export default function useModalDialog(isOpen, onClose, onKeyDown) {
  const dialogRef = useRef(null);
  const handlers = useRef({ onClose, onKeyDown });
  handlers.current = { onClose, onKeyDown };

  useEffect(() => {
    if (!isOpen || !dialogRef.current) return undefined;
    const dialog = dialogRef.current;
    const trigger = document.activeElement;
    if (scrollLocks === 0) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    scrollLocks += 1;
    const focusable = () => Array.from(dialog.querySelectorAll(focusableSelector))
      .filter(element => element.getClientRects().length && !element.closest('[hidden]'));
    const initial = dialog.querySelector('[data-dialog-autofocus]') || focusable()[0] || dialog;
    initial.focus({ preventScroll: true });

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        handlers.current.onClose?.();
        return;
      }
      if (event.key === 'Tab') {
        const elements = focusable();
        const first = elements[0] || dialog;
        const last = elements[elements.length - 1] || dialog;
        if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
          event.preventDefault();
          first.focus();
        }
      }
      handlers.current.onKeyDown?.(event);
    }
    function containFocus(event) {
      if (!dialog.contains(event.target)) (focusable()[0] || dialog).focus({ preventScroll: true });
    }
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusin', containFocus);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', containFocus);
      scrollLocks -= 1;
      if (scrollLocks === 0) document.body.style.overflow = previousOverflow;
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [isOpen]);

  return dialogRef;
}
