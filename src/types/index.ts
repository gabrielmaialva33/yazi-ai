import { Message, Whatsapp } from 'venom-bot'

export type MiddlewareFn = (message: Message, client: Whatsapp) => void

export type User = {
  id: string
  name: string
  username: string
  phone: string
  avatar?: string
  message: string
}

export type ContextArgs = {
  username: string
  reply_to_username?: string
  text: string
  reply_to_text?: string
}
