import { create, Whatsapp } from 'venom-bot'

export const bot = async () => {
  await create({ session: 'yazi_ai', multidevice: true }).then((client: Whatsapp) => start(client))
}

const start = async (client: Whatsapp) => {
  await client.onMessage((message) => {
    if (message.body === 'Oi' && !message.isGroupMsg) {
      client.sendImage(
    }
  })
}
