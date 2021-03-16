import { cac } from 'cac'
import fs from 'fs/promises'
import path from 'path'

const cli = cac('guru-cli')

async function loadCommands(): Promise<void> {
  let files = await fs.readdir(path.resolve(__dirname, 'commands'))
  files = files.filter((file) => !file.includes('.d.ts'))
  const commands = await Promise.all(
    files.map(async (file) => await import(path.resolve(__dirname, 'commands/', file))),
  )
  for (const { default: command } of commands) {
    await command(cli)
  }
}

export async function run(): Promise<void> {
  await loadCommands()
  cli.command('[...default]', 'display help if no command given').usage('--help').action(cli.outputHelp)
  cli.help()
  cli.parse()
}

if (require.main === module) {
  run().catch(console.error)
}
