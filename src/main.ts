import { Bot } from '@/bot/core/bot'
import { Logger } from '@/helpers/logger.utils'
;(async () => await Bot().then(() => Logger.info('Bot started successfully', 'bot')))()
