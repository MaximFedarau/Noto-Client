export function contentFormat(content: string): string {
  if (content.length <= 300) return content;
  const shortContent = content.substring(0, 300);
  const closingTag = shortContent.lastIndexOf('<');
  if (closingTag <= 0) {
    return shortContent + '...';
  } else {
    return shortContent.substring(0, closingTag) + '...';
  }
}
