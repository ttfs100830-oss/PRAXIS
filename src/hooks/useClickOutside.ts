import { useEffect, useRef } from "react";

/** Calls the handler when a pointer press lands outside the returned element. */
export function useClickOutside<T extends HTMLElement>(
  onOutside: () => void,
) {
  const ref = useRef<T>(null);
  const handlerRef = useRef(onOutside);
  handlerRef.current = onOutside;

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handlerRef.current();
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  return ref;
}
