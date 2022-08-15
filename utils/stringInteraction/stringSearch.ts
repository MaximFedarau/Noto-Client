const equating = (string: string) => {
  return string.trim().toLowerCase();
};

export const stringSearch = (defaultString: string, searchString: string) => {
  return equating(defaultString).includes(equating(searchString));
};
