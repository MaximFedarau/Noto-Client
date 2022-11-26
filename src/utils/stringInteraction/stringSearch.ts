const equating = (string: string) => {
  return string.trim().toLowerCase();
};

export const stringSearch = (defaultString = '', searchString = '') => {
  return equating(defaultString).includes(equating(searchString));
};
