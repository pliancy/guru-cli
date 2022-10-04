import chalk from 'chalk'
import { CliUx } from '@oclif/core'

import guru from '../lib/guruClient'
import { GuruCard } from '../lib/guru'
import { checkAuth, handleCardsFilter } from '../lib/helpers'

export default async (cli: any): Promise<void> => {
    cli.command('verify-by-title <title>', 'Verifies cards by card title.')

        .option('--collection [collectionName]', 'Filter cards by collection.')

        .action(async (title: string, options?: any) => {
            checkAuth()
            CliUx.ux.action.start('Searching for cards')
            const cardsRaw = await guru.getAllCardsRaw()
            let filteredCards = handleCardsFilter(
                `title:"^${title}$"`,
                cardsRaw,
                '-i',
            ) as GuruCard[]

            if (options.collection) {
                filteredCards = filteredCards.filter(
                    (card) => card.collection === options.collection,
                )
            }

            if (!filteredCards.length) {
                CliUx.ux.action.stop(`❌ ${filteredCards.length} cards found matching your title`)
                return
            }

            CliUx.ux.action.stop(
                `✅  ${filteredCards.length} card${filteredCards.length > 1 ? 's' : ''} match${
                    filteredCards.length > 1 ? '' : 'es'
                } your collection and title\n---------------------------`,
            )

            filteredCards.map((card) =>
                console.log(
                    `${chalk.bold.blueBright(card.collection)} ${chalk.bold.greenBright(
                        card.title,
                    )} (${card.link})`,
                ),
            )

            const confirm = await CliUx.ux.confirm(
                'Do you wish to verify the identified card(s)? (Y/n)',
            )
            if (!confirm) return

            CliUx.ux.action.start(`Verifying ${title}`)

            for (const card of filteredCards) {
                await guru.verifyCardByID(card)
            }
        })
}
