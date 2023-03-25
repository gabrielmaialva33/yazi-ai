import chalk from 'chalk'

export const Logger = {
  info: (message: string, context: string) =>
    console.log(
      `${chalk.bgGreen(`${chalk.black.bold('[info]')}`)} ${chalk.blue(`(${context})`)} ${message}`
    ),

  error: (message: string | unknown, context: string) =>
    console.log(
      `${chalk.bgRed(`${chalk.black.bold('[error]')}`)} ${chalk.blue(`(${context})`)} ${message}`
    ),

  warn: (message: string, context: string) =>
    console.log(
      `${chalk.bgYellow(`${chalk.black.bold('[warn]')}`)} ${chalk.blue(`(${context})`)} ${message}`
    ),

  debug: (message: string, context: string) =>
    console.log(
      `${chalk.bgBlue(`${chalk.black.bold('[debug]')}`)} ${chalk.blue(`(${context})`)} ${message}`
    ),
}
