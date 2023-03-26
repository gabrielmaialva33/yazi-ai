import 'dotenv/config'

import { cleanEnv, str } from 'envalid'

export const Env = cleanEnv(process.env, {
  OPENAI_TOKEN: str({
    desc: 'OpenAI API Token',
    example: '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',
    docs: 'https://beta.openai.com/docs/api-reference/authentication',
  }),
})
