import * as fs from 'fs'
import * as process from 'process'
import jimp from 'jimp'

import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from 'openai'

import { Env } from '@/env'
import { StringUtils } from '@/helpers/string.utils'
import { Logger } from '@/helpers/logger.utils'
import * as console from 'console'

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

  public async chat(text: string, username: string) {
    const system = fs.readFileSync(process.cwd() + '/tmp/system.gpt.txt', 'utf8')
    const history = fs.readFileSync(process.cwd() + '/tmp/history.gpt.txt', 'utf8')

    // split the text in lines
    const lines_history: string[] = history.split('\n') as unknown as string[]
    lines_history.pop()
    console.log({ lines_history })

    const messages_history = lines_history.map((line) => {
      const [user, message] = line.split(']:') || line.split('):')

      const reply_to_user = user.includes('(') ? user.split('(')[1].split(')')[0] : user
      const new_user = user.includes('(') ? user.split('(')[0] : user

      const modified_message = reply_to_user
        ? message.slice(0, 1) + `(reply: ${reply_to_user}) ` + message.slice(1)
        : message

      return {
        role:
          user.includes('Yazi AI') && !user.includes('(')
            ? ChatCompletionRequestMessageRoleEnum.Assistant
            : ChatCompletionRequestMessageRoleEnum.User,
        name: new_user ? new_user : user,
        content: modified_message,
      }
    })

    const line_text = text.split(']:')
    const [user, message] = line_text
    const reply_to_user = user.includes('(') ? user.split('(')[1].split(')')[0] : user
    const new_user = user.includes('(') ? user.split('(')[0] : user

    console.log({ reply_to_user, new_user, message })

    const modified_message = reply_to_user
      ? message.slice(0, 1) + `(reply: ${reply_to_user}) ` + message.slice(1)
      : message

    const messages_text = {
      role:
        user.includes('Yazi AI') && !user.includes('(')
          ? ChatCompletionRequestMessageRoleEnum.Assistant
          : ChatCompletionRequestMessageRoleEnum.User,
      name: new_user ? new_user : user,
      content: modified_message.split('\n')[0],
    }

    messages_history.push(messages_text)

    const messages: Array<ChatCompletionRequestMessage> = [
      {
        role: ChatCompletionRequestMessageRoleEnum.System,
        content: system,
      },
      ...messages_history,
    ]

    console.log({ messages })

    return this.createChatCompletion({
      model: 'gpt-3.5-turbo',
      stop: ['|'],
      max_tokens: 500,
      temperature: 1,
      presence_penalty: Math.random() * (0.3 - 0.1) + 0.1,
      frequency_penalty: Math.random() * (1.0 - 0.5) + 0.5,
      messages: messages,
      n: 1,
    })
  }
}

export const AI = new OpenAI()
