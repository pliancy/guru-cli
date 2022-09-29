import chalk from "chalk";
import cliux from "cli-ux";

import guru from "../lib/guruClient";
import { GuruCardRaw } from "../lib/guru";
import { backupCards, checkAuth, handleCardsFilter } from "../lib/helpers";

export default async (cli: any): Promise<void> => {
  cli
    .command(
      "find-replace <find> <replace> [filter]",
      "Find and replace across guru articles (supports regex in find) with optional filtering"
    )
    .option("-f, --force", "Skip confirmation, BE CAREFUL WITH THIS OPTION!")
    .option("-i, --ignore-case", "Ignore case in the finding regex string")
    .option(
      "-C, --confirm",
      "confirm making the changes (required to push modifications to guru)"
    )
    .option(
      "-w, --preview-width <size>",
      "characters of text around the match when in preview mode (no --confirm)"
    )
    .action(
      async (find: string, replace: string, filter: string, options: any) => {
        checkAuth();
        cliux.action.start("Finding cards based on filter");
        const cardsRaw = await guru.getAllCardsRaw();
        const filteredCards = handleCardsFilter(filter, cardsRaw, options, {
          raw: true,
        }) as GuruCardRaw[];
        let reFlags = "g";
        if (options.ignoreCase) reFlags += "i";
        const matchedCards = filteredCards.filter((card) =>
          new RegExp(find, reFlags).test(card.content)
        );

        if (!matchedCards.length) {
          cliux.action.stop(
            `❌ ${matchedCards.length} cards found matching "${find}"`
          );
          return;
        }
        cliux.action.stop(
          `✅ ${matchedCards.length} cards found matching "${find}"`
        );

        if (!options.confirm) {
          console.log("Preview:\n------------------------");
          for (const card of matchedCards) {
            console.log(
              `${chalk.bold.blueBright(card.preferredPhrase)} (${chalk.blue(
                `https://app.getguru.com/card/${card.slug}`
              )})`
            );
            const matches = [
              ...card.content.matchAll(new RegExp(find, reFlags)),
            ];
            if (!matches.length)
              throw new Error(
                `Unknown regex matching error occurred on card ${card.preferredPhrase}`
              );
            for (const match of matches) {
              const matchText = match[0] as string;
              const matchIndex = match.index as number;
              const SIZE_AROUND = options.previewWidth
                ? Number(options.previewWidth)
                : 40;
              const beforeText = card.content.substring(
                matchIndex > SIZE_AROUND ? matchIndex - SIZE_AROUND : 0,
                matchIndex
              );
              const afterText = card.content.substring(
                matchIndex + matchText.length,
                matchIndex + matchText.length + SIZE_AROUND >=
                  card.content.length - 1
                  ? card.content.length - 1
                  : matchIndex + matchText.length + SIZE_AROUND
              );
              console.log(
                `${beforeText}${chalk.bold.redBright(
                  matchText
                )}${chalk.bold.green(replace)}${afterText}`
              );
            }
            console.log("");
          }
          console.log(
            `Rerun this same command with --confirm to push these changes to these ${matchedCards.length} Guru cards`
          );
          return;
        }

        if (!options.force) {
          const backup = await cliux.confirm(
            "Would you like to backup card data before making changes? (RECOMMENDED) (Y/n)"
          );
          if (backup) {
            await backupCards("./");
          }

          const confirm = await cliux.confirm(
            `This will replace all instances matching "${chalk.bold.redBright(
              find
            )}" with ${chalk.bold.green(replace)} in ${
              matchedCards.length
            } cards. Continue? (Y/n)`
          );
          if (!confirm) return;
        }

        for (const card of matchedCards) {
          card.content = card.content.replace(
            new RegExp(find, reFlags),
            replace
          );
          await guru.updateCardRaw(card);
        }
        console.log(
          `Successfully replaced "${chalk.bold.redBright(
            find
          )}" with "${chalk.bold.green(replace)}" across ${
            matchedCards.length
          } cards.`
        );
      }
    );
};
