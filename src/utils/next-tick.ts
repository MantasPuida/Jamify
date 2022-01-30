import { Noop } from "./noop";

export async function NextTick(callback: () => void = Noop): Promise<void> {
  const promise = Promise.resolve();
  promise.then(callback);
  return promise;
}
