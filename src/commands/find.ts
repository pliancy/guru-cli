import { CliUx } from '@oclif/core'
import chalk from 'chalk'

import guru from '../lib/guruClient'
import { GuruCard } from '../lib/guru'
import { checkAuth, handleCardsFilter } from '../lib/helpers'

export default async (cli: any): Promise<void> => {
    cli.command(
        'find <filter>',
        'find cards based on search filter (full ECMAScript compliant regex supported)',
    )
        .example(
            `Find all cards where content has 'delete me'
guru-cli find 'content:"delete me"'
`,
        )
        .example(
            `Find all cards where collection has "Software" OR "Engineering" and title has "Overview"
guru-cli find 'collection:Software,Engineering title:Overview'
`,
        )
        .example(
            `Find cards where verifier is EXACTLY "bob@example.com"
guru-cli find 'verifier:"^bob@example\\\\.com$"'
`,
        )
        .option('-i, --ignore-case', 'Ignore case in the finding regex string')
        .action(async (filter: string, options: any) => {
            checkAuth()
            CliUx.ux.action.start('Searching for cards')
            const cardsRaw = await guru.getAllCardsRaw()
            const filteredCards = handleCardsFilter(filter, cardsRaw, options) as GuruCard[]
            if (!filteredCards.length) {
                CliUx.ux.action.stop(`❌ ${filteredCards.length} cards found matching your filter`)
                return
            }

            CliUx.ux.action.stop(
                `✅  ${filteredCards.length} cards matching your filter\n---------------------------`,
            )
            filteredCards.map((card) =>
                console.log(`${chalk.bold.blueBright(card.title)} (${card.link})`),
            )
        })
}
