export function parseTitle(title?: string): string {
  if (!title) {
    return "";
  }

  if (title.endsWith("]")) {
    const regexBrackets: RegExp = /\[.*?\]/g;
    const replacedTitle = title.replaceAll(regexBrackets, "");
    if (replacedTitle.endsWith(".") || replacedTitle.endsWith(" ")) {
      return replacedTitle.substring(0, replacedTitle.length - 1);
    }

    return replacedTitle;
  }

  if (title.endsWith(")")) {
    const regexParentheses: RegExp = /\(.*\)/g;
    const replacedTitle = title.replaceAll(regexParentheses, "");
    if (replacedTitle.endsWith(".") || replacedTitle.endsWith(" ")) {
      return replacedTitle.substring(0, replacedTitle.length - 1);
    }

    return replacedTitle;
  }

  return title;
}
