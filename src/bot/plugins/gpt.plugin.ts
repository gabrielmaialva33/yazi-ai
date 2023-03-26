import * as fs from 'fs'
import * as process from 'process'

import { Configuration, OpenAIApi } from 'openai'

import { Env } from '@/env'
import { StringUtils } from '@/helpers/string.utils'
import { Logger } from '@/helpers/logger.utils'

class OpenAI extends OpenAIApi {
  constructor() {
    super(new Configuration({ apiKey: Env.OPENAI_TOKEN }))
  }

  public async complete(text: string, username: string) {
    const main = fs.readFileSync(process.cwd() + '/tmp/main.gpt.txt', 'utf8')
    const history = fs.readFileSync(process.cwd() + '/tmp/history.gpt.txt', 'utf8')

    Logger.info(
      `context: ${JSON.stringify(StringUtils.info_text(main + history + text))}`,
      'ai/openai'
    )

    const prompt = StringUtils.remove_breaklines(main + history + text + `Yazi AI(${username}):|`)

    return this.createCompletion(
      {
        prompt,
        model: 'text-davinci-003',
        temperature: 0.9,
        max_tokens: 300,
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
        n: 1,
        stop: ['|'],
      },
      { timeout: 30000 }
    )
  }
}

export const AI = new OpenAI()
