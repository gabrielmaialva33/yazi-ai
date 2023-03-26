import * as process from 'process'
import * as fs from 'fs'

import { Context } from '@/types'
import { StringUtils } from '@/helpers/string.utils'
import { Logger } from '@/helpers/logger.utils'

export const HistoryUtils = {
  build_gpt_history: (input: string, output: string, reply_username: string) => {
    const io = input.replace(`\nYazi AI(${reply_username}):|`, '')
    return `${io}Yazi AI(${reply_username}):|${output}|\n`
  },

  build_reply_gpt_history: (input: string, output: string, reply_username: string) => {
    const io = input.replace(`\nYazi AI(${reply_username}):|`, '')
    return `${io}Yazi AI(${reply_username}):|${output}|\n`
  },

  build_chat_history({ user, reply_to_user, text }: Context) {
    if (reply_to_user?.name)
      return `${user.name}(${reply_to_user.name})[${user.datetime}]:|${text}|\n`
    return `${user.name}[${user.datetime}]:|${text}|\n`
  },

  write_history(text: string) {
    if (fs.existsSync(process.cwd() + '/tmp/history.gpt.txt')) {
      const main = fs.readFileSync(process.cwd() + '/tmp/main.gpt.txt', 'utf8')
      const history = fs.readFileSync(process.cwd() + '/tmp/history.gpt.txt', 'utf8')
      const prompt = StringUtils.remove_breaklines(main + history)
      if (StringUtils.count_tokens(prompt) > 3700) HistoryUtils.slice_history(2)
    }
    fs.createWriteStream(process.cwd() + '/tmp/history.gpt.txt', { flags: 'a' }).write(text)
  },

  slice_history: (n: number) => {
    const history_file = process.cwd() + '/tmp/history.gpt.txt'
    if (!fs.existsSync(history_file)) return
    const lines = fs.readFileSync(history_file, 'utf8').split('\n')
    fs.writeFileSync(history_file, lines.slice(n).join('\n'))
  },

  reset_history: () => {
    const isExists = fs.existsSync(process.cwd() + '/tmp/history.gpt.txt')
    if (isExists) fs.unlinkSync(process.cwd() + '/tmp/history.gpt.txt')
    fs.createWriteStream(process.cwd() + '/tmp/history.gpt.txt', { flags: 'a' }).write('')
    Logger.debug('History reseted', 'history/utils')
  },
}
