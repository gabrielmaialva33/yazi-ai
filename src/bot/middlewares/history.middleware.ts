import { Whatsapp } from 'venom-bot'

import { CustomMessage, MiddlewareFn } from '@/types'

import { Logger } from '@/helpers/logger.utils'
import { ContextUtils } from '@/helpers/context.utils'
import { HistoryUtils } from '@/helpers/history.utils'
import { StringUtils } from '@/helpers/string.utils'

export const HistoryMiddleware: MiddlewareFn = async (message: CustomMessage, client: Whatsapp) => {
  try {
    if (StringUtils.text_includes(message.body, ['yazi'])) return
    if (message.type === 'reply' && message.quotedParticipant === '5515996601743@c.us') return
    if (StringUtils.text_includes(message.body, ['!imagine', '!variation'])) return
    if (StringUtils.text_includes(message.type, ['image', 'sticker', 'video', 'document', 'ptt']))
      return
    if (message.from !== '120363089352430268@g.us') return

    const context = await ContextUtils.get_context(message, client)
    const history = HistoryUtils.build_chat_history(context)

    Logger.debug(JSON.stringify(history), 'history/middleware')
    HistoryUtils.write_history(history)

    return
  } catch (error) {
    Logger.error(error, 'history/middleware')
  }
}
