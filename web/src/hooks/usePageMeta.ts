import { useEffect } from 'react';

export function usePageMeta(name: string) {
  useEffect(() => {
    document.title = `${name} | Rythm Daw`;
  }, [name]);
}
