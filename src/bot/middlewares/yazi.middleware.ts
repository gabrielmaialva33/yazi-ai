import { Message, Whatsapp } from 'venom-bot'
import { MiddlewareFn } from '@/types'
import { ContextUtils } from '@/helpers/context.utils'
import * as console from 'console'

export const YaziMiddleware: MiddlewareFn = async (message: Message, client: Whatsapp) => {
  const context = await ContextUtils.get_context(message, client)
  console.info(context)
  await client.sendText(message.from, 'Oi, tudo bem?')
}
