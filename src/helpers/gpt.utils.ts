import { Context } from '@/types'

export const GptUtils = {
  build_input: ({ user, text }: Context) => {
    return `${user.name}(Yazi AI)[${user.datetime}]:|${text}|\n`
  },
}
