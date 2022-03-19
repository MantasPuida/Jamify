type HashType = Record<string, string>;

export namespace Helpers {
  export const getTokenFromHash = (locationHash: string): HashType => {
    const hash: HashType = locationHash
      .substring(1)
      .split("&")
      .reduce((previousValue: HashType, currentValue) => {
        if (currentValue) {
          const parts = currentValue.split("=");
          // eslint-disable-next-line no-param-reassign
          previousValue[parts[0]] = decodeURIComponent(parts[1]);
        }
        return previousValue;
      }, {});

    return hash;
  };
}
