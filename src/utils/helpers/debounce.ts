export const debounce = <TArgs extends unknown[]>(
  fn: (this: any, ...args: TArgs) => unknown,
  ms = 300
) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: TArgs) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};
