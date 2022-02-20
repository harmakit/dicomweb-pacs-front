import { isObject } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

export class PackedError {
  constructor({ message }) {
    this.message = String(message);
    this.id = uuidv4();
  }
}

export function packError(error) {
  let message = null;
  if (typeof error === 'string') {
    message = error;
  } else if (isObject(error) && typeof error.message === 'string') {
    ({ message } = error);
  }
  return new PackedError({
    message,
    id: uuidv4(),
  });
}
