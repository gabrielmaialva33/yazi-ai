import { create, Whatsapp } from 'venom-bot'
import { YaziMiddleware } from '@/bot/middlewares/yazi.middleware'

export const Bot = async () =>
  await create({
    session: 'yazi_ai',
    multidevice: true,
  }).then((client) => start(client))

const start = async (client: Whatsapp) => {
  await client.onMessage(async (message) => {
    await YaziMiddleware(message, client)
  })
}
