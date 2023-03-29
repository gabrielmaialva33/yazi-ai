import { Whatsapp } from 'venom-bot'
import { CustomMessage, MiddlewareFn } from '@/types'

import { AI } from '@/bot/plugins/gpt.plugin'

import { ContextUtils } from '@/helpers/context.utils'
import { StringUtils } from '@/helpers/string.utils'
import { GptUtils } from '@/helpers/gpt.utils'
import { HistoryUtils } from '@/helpers/history.utils'
import { Logger } from '@/helpers/logger.utils'
import * as mime from 'mime-types'
import * as fs from 'fs'

export const GptMiddleware: MiddlewareFn = async (message: CustomMessage, client: Whatsapp) => {
  const context = await ContextUtils.get_context(message, client)

  // if users call the bot, it will reply with a message
  if (StringUtils.text_includes(message.body, ['yazi'])) {
    const input = GptUtils.build_input(context)

    await client.startTyping(message.from)

    const response = await AI.complete(input, context.user.name)
    if (response.data.choices.length === 0 || !response.data.choices[0].text) return

    const output = response.data.choices[0].text
    const history = HistoryUtils.build_gpt_history(input, output, context.user.name)

    HistoryUtils.write_history(history)

    return client
      .reply(message.from, output + '\n', message.id.toString())
      .catch((error) => Logger.error(JSON.stringify(error), 'yazi/middleware'))
  }

  // if users reply to a message, it will reply with a message
  if (
    message.type === 'reply' &&
    message.quotedParticipant === '5515996601743@c.us' &&
    !StringUtils.text_includes(message.body, ['!variation'])
  ) {
    const input = GptUtils.build_input(context)

    await client.startTyping(message.from)

    const response = await AI.complete(input, context.user.name)
    if (response.data.choices.length === 0 || !response.data.choices[0].text) return

    const output = response.data.choices[0].text
    const history = HistoryUtils.build_reply_gpt_history(input, output, context.user.name)

    HistoryUtils.write_history(history)

    return client
      .reply(message.from, output + '\n', message.id['_serialized'])
      .catch((error) => Logger.error(JSON.stringify(error), 'yazi/middleware'))
  }

  if (StringUtils.text_includes(message.body, ['!imagine'])) {
    const text = message.body.replace('!imagine', '').trim()
    if (!text) return

    const response = await AI.imagine(text)
    if (!response.data.data[0].url) return

    const imageUrl = response.data.data[0].url
    await client.sendImage(message.from, imageUrl, 'image.png', text)
  }

  if (StringUtils.text_includes(message.body, ['!variation'])) {
    // @ts-ignore
    const quotedMsg = message['quotedMsg']
    const buffer = await client.decryptFile(quotedMsg)

    const fileName = `image.${mime.extension(quotedMsg.mimetype)}`
    await fs.writeFileSync(fileName, buffer, 'base64')

    const response = await AI.variation(fileName)
    if (!response.data.data[0].url) return

    const imageUrl = response.data.data[0].url
    await client.sendImage(message.from, imageUrl, 'image.png', quotedMsg.caption)
  }

  return
}
