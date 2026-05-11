import type { KeyboardEvent } from 'react';

export const blockInvalidCharacters = (e: KeyboardEvent<HTMLInputElement>) =>
  ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();
