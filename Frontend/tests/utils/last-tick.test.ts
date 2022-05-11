import { LastTick } from "../../src/utils/last-tick";

namespace PromiseTaskContracts {
  export type ResolveMethod<T> = (result: T) => void;
  export type RejectMethod = (err?: any) => void;
  export type Executor<T> = (
    resolve: PromiseTaskContracts.ResolveMethod<T>,
    reject: PromiseTaskContracts.RejectMethod
  ) => void;
}

class PromiseTask<T = void> {
  constructor(private executor?: PromiseTaskContracts.Executor<T>) {}

  public resolve: PromiseTaskContracts.ResolveMethod<T> = () => {
    throw new Error("Promise is not yet initialized.");
  };
  public reject: PromiseTaskContracts.RejectMethod = () => {
    throw new Error("Promise is not yet initialized.");
  };

  private readonly _promise: Promise<T> = new Promise((resolve, reject) => {
    this.resolve = resolve;
    this.reject = reject;
    if (this.executor) {
      this.executor(this.resolve, this.reject);
    }
  });

  public get promise(): Promise<T> {
    return this._promise;
  }
}

describe("LastTick", () => {
  it("execute Asynchronously", async () => {
    const promiseTask = new PromiseTask();

    const jestFunction = jest.fn();
    const resolvePromiseTask = () => {
      jestFunction();
      promiseTask.resolve();
    };

    expect(jestFunction).not.toHaveBeenCalled();

    LastTick(resolvePromiseTask);

    expect(jestFunction).not.toHaveBeenCalled();

    await promiseTask.promise;

    expect(jestFunction).toHaveBeenCalled();
  });

  it("execute Synchronously", () => {
    const promiseTask = new PromiseTask();

    const jestFunction = jest.fn();
    const resolvePromiseTask = () => {
      jestFunction();
      promiseTask.resolve();
    };

    expect(jestFunction).not.toHaveBeenCalled();

    LastTick(resolvePromiseTask);

    expect(jestFunction).not.toHaveBeenCalled();
  });
});
