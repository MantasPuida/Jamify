type HashType = Record<string, string>;

export const getHash = (locationHash: string): HashType => {
  const hash: HashType = locationHash
    .substring(1)
    .split("&")
    .reduce((initial: HashType, item) => {
      if (item) {
        const parts = item.split("=");
        // eslint-disable-next-line no-param-reassign
        initial[parts[0]] = decodeURIComponent(parts[1]);
      }
      return initial;
    }, {});

  return hash;
};
