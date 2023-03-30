import { create, Message, Whatsapp } from 'venom-bot'

import { GptMiddleware, HistoryMiddleware } from '@/bot/middlewares'

export const Bot = async () =>
  await create({
    session: 'yazi_ai',
    disableWelcome: true,
    disableSpins: false,
  }).then((client) => start(client))

const start = async (client: Whatsapp) => {
  await client.onMessage(async (message: Message) => {
    await HistoryMiddleware(message, client)
    await GptMiddleware(message, client)
  })
}
