import chalk from 'chalk'
import Progress from 'cli-progress'
import cliux from 'cli-ux'

import guru from '../lib/guruClient'
import { GuruCard } from '../lib/guru'
import { checkAuth, handleCardsFilter } from '../lib/helpers'

export default async (cli: any): Promise<void> => {
    cli.command('verify-all [filter]', 'Verifies all unverified cards (see README)')
        .example(
            `Verify all cards 'guru-cli verify-all"'
`,
        )
        .example(
            `Verify all cards with a filter 'guru-cli verify-all content:"something to match on"'
    `,
        )
        .option('-i, --ignore-case', 'Ignore case in the finding regex string')
        .option('-f, --force', 'Skip confirmation, BE CAREFUL WITH THIS OPTION!')
        .action(async (filter: string, options: any) => {
            checkAuth()
            cliux.action.start('Gathering all unverified cards')
            const unverifiedCards = await guru.getAllUnverifiedCardsRaw()
            const filteredCards = handleCardsFilter(filter, unverifiedCards, options) as GuruCard[]
            cliux.action.stop(`✅ ${filteredCards.length} unverified cards found.`)

            if (!filteredCards.length) {
                console.log('You have no unverified cards currently!')
                return
            }

            console.log('Preview:\n------------------------')
            for (const card of filteredCards) {
                console.log(chalk.bold.blueBright(card.title))
            }

            if (!options.force) {
                const confirm = await cliux.confirm(
                    `This will verify ${filteredCards.length} cards currently in an unverified state. Continue? (Y/n)`,
                )
                if (!confirm) return
            }

            const progress = new Progress.Bar(
                {
                    format: `Verifying Cards ${chalk.hex('#7F4BAE')(
                        '{bar}',
                    )} {percentage}% | Current Card: {value}/{total} | Name: ${chalk.bold.hex(
                        '#D7E150',
                    )('{currentCard}')}`,
                },
                Progress.Presets.shades_grey,
            )
            progress.start(filteredCards.length, 0, { currentCard: '' })
            for (const card of filteredCards) {
                progress.increment(1, { currentCard: card.title })
                await guru.verifyCardByID(card)
            }
            progress.stop()
        })
}
