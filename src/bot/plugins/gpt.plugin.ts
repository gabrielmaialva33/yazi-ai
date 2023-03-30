import * as fs from 'fs'
import * as process from 'process'
import jimp from 'jimp'

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
        temperature: Math.random() * (1.0 - 0.5) + 0.5,
        max_tokens: 300,
        frequency_penalty: Math.random() * (1.0 - 0.5) + 0.5,
        presence_penalty: Math.random() * (0.3 - 0.1) + 0.1,
        stop: ['|'],
      },
      { timeout: 30000 }
    )
  }

  public async imagine(text: string, n?: number) {
    Logger.info(`imagining text: ${text}`, 'ai/openai')
    return this.createImage({
      prompt: text,
      n: n || 1,
      size: '512x512',
      response_format: 'url',
    })
  }

  public async variation(path: string) {
    // change the file extension to png
    const file = await fs.readFileSync(path)
    await jimp.read(file).then((image) => image.writeAsync(`${path}.png`))

    // redimension the image
    const image = await jimp.read(`${path}.png`)
    await image.resize(512, 512).writeAsync(`${path}.png`)

    Logger.info(`Variating image: ${path}.png`, 'IA')

    return this.createImageVariation(fs.createReadStream(`${path}.png`) as any, 1, '512x512', 'url')
  }
}

export const AI = new OpenAI()
