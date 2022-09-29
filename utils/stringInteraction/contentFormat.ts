export const contentFormat = (content: string) => {
  if (content.length <= 300) return content; // optimal length
  const shortContent = content.substring(0, 300);
  const closingTag = shortContent.lastIndexOf('<'); // we don't want to break tags (elements)
  if (closingTag < 0) {
    return shortContent + '...';
  } else {
    return shortContent.substring(0, Math.max(closingTag, 300)) + '...';
  }
};
