export function parseTitle(title?: string): string {
  if (!title) {
    return "";
  }

  if (title.endsWith("]")) {
    const regexBrackets: RegExp = /\[.*?\]/g;
    return title.replaceAll(regexBrackets, "");
  }

  if (title.endsWith(")")) {
    const regexParentheses: RegExp = /\(.*\)/g;
    return title.replaceAll(regexParentheses, "");
  }

  return title;
}
