export const StringUtils = {
  normalize_username: (first_name: string) => {
    if (!first_name) return 'no_username'

    const username = first_name
      .normalize('NFKC')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .replace(/(\r\n|\n|\r)/gm, '')
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .trim()
      .slice(0, 20)

    // check if username is empty
    if (username === ' ') return 'no_username'
    if (username.trim() === '') return 'no_username'

    //return username.replace(/[^a-zA-Z0-9_-]/g, '_')

    return username
  },

  normalize_text: (text: string) => {
    if (!text) return ''

    const source = text
      .normalize('NFKC')
      .replace(/\s+/g, ' ')
      .replace(/(\r\n|\n|\r)/gm, '')
      .trim()
    return source.slice(0, 500)
  },

  text_includes: (text: string, includes: string[]) => {
    if (!text) return false
    return includes.some((include) => text.toLowerCase().includes(include))
  },

  remove_breaklines: (text: string) => {
    return text.replace(/(\r\n|\n|\r)/gm, '')
  },

  count_tokens: (text: string) => {
    return text.length / 2
  },

  count_words: (text: string) => {
    return text.split(/\s+/).length
  },

  count_lines: (text: string) => {
    return text.split(/\r\n|\r|\n/).length
  },

  count_characters: (text: string) => {
    return text.length
  },

  info_text: (text: string) => {
    return {
      tokens: StringUtils.count_tokens(text),
      words: StringUtils.count_words(text),
      lines: StringUtils.count_lines(text),
      characters: StringUtils.count_characters(text),
    }
  },
}
