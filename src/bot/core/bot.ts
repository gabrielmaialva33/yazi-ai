import { create, Message, Whatsapp } from 'venom-bot'

import { HistoryMiddleware, YaziMiddleware } from '@/bot/middlewares'

export const Bot = async () =>
  await create({
    session: 'yazi_ai',
    multidevice: true,
  }).then((client) => start(client))

const start = async (client: Whatsapp) => {
  await client.onMessage(async (message: Message) => {
    await HistoryMiddleware(message, client)
    await YaziMiddleware(message, client)
  })
}
