import { Message, Whatsapp } from 'venom-bot'
import { LastReceivedKey } from 'venom-bot/dist/api/model/message'

export type MiddlewareFn = (message: Message, client: Whatsapp) => void

export type User = {
  id: string
  name: string
  username: string
  phone: string
  avatar?: string
  message: string
  datetime: string
}

export type Context = {
  user: User
  reply_to_user?: User
  text: string
  reply_to_text?: string
}

export type CustomMessage = Message & { quotedParticipant?: string; id: any }
