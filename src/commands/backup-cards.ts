import { backupCards, checkAuth } from '../lib/helpers'

export default async (cli: any): Promise<void> => {
  cli
    .command(
      'backup-cards <directory-path>',
      'create a backup of all cards in Guru account in JSON at specified file path',
    )
    .action(async (directoryPath: string) => {
      checkAuth()
      await backupCards(directoryPath)
    })
}
