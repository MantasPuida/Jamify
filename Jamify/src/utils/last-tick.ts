import { Noop } from "./noop";

export async function LastTick(callback: () => void = Noop): Promise<void> {
  const promise = new Promise<void>((resolve) => {
    setTimeout(resolve);
  });

  promise.then(callback);
  return promise;
}
