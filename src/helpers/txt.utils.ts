export const TxtUtils = {
  italic: (text: string) => `_${text}_`,

  bold: (text: string) => `*${text}*`,

  strikethrough: (text: string) => `~${text}~`,

  code: (text: string) => `\`\`\`${text}\`\`\``,

  mention: (text: string, id: string) => `@${id} ${text}`,
}
