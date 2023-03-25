import { Message, Whatsapp } from 'venom-bot'

import { StringUtils } from '@/helpers/string.utils'
import { User } from '@/types'

export const ContextUtils = {
  get_user: async (message: Message, client: Whatsapp): Promise<User> => {
    const user = await client.getContact(message.author)
    return {
      id: user.id._serialized,
      name: StringUtils.normalize_username(user.pushname),
      username: StringUtils.normalize_username(user.pushname).replace(/[^a-zA-Z0-9_-]/g, '_'),
      phone: user.id.user,
      avatar: user.profilePicThumbObj.imgFull ? user.profilePicThumbObj.imgFull : undefined,
      message: StringUtils.normalize_text(message.body),
    }
  },

  get_reply_to_user: async (message: Message | any, client: Whatsapp) => {
    if (!(message.type === 'reply')) return
    const user = await client.getContact(message.to)
    return {
      id: user.id._serialized,
      name: StringUtils.normalize_username(user.pushname),
      username: StringUtils.normalize_username(user.pushname).replace(/[^a-zA-Z0-9_-]/g, '_'),
      phone: user.id.user,
      avatar: user.profilePicThumbObj.imgFull ? user.profilePicThumbObj.imgFull : undefined,
      message: message.quotedMsg ? message.quotedMsg.body : undefined,
    }
  },

  get_context: async (message: Message, client: Whatsapp) => {
    const user = await ContextUtils.get_user(message, client)
    const reply_to_user = await ContextUtils.get_reply_to_user(message, client)
    return {
      user,
      reply_to_user,
      text: message.body,
      reply_to_text: reply_to_user ? StringUtils.normalize_text(reply_to_user.message) : undefined,
    }
  },
}