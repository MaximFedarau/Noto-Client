export const titleFormat = (title: string) => {
  if (title.length <= 100) return title; // optimal length
  const shortTitle = title.substring(0, 100);
  return shortTitle + '...';
};
