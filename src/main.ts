import { Bot } from '@/bot/core/bot'
import { Logger } from '@/helpers/logger.utils'
import { HistoryUtils } from '@/helpers/history.utils'
;(async () =>
  await Bot().then(() => {
    HistoryUtils.reset_history()
    Logger.info('Bot started successfully', 'bot')
  }))()
