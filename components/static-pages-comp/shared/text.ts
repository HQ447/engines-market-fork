export function capitalizeHeading(text: string) {
  const match = text.match(/^(\s*[^\p{L}]*)(\p{Ll})/u);
  return match ? `${match[1]}${match[2].toLocaleUpperCase()}${text.slice(match[0].length)}` : text;
}
