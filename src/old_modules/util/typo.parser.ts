import { commandsList } from './commands-list';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const levenshtein = require('js-levenshtein');

export class TypoParser {
  public static parse(query: string): string {
    const words = query.split(' ');
    const fixedWords = [];
    words.forEach((word, pos) => {
      const threshold = word.length;
      let data = { index: -1, min: threshold };
      commandsList.forEach((command, index) => {
        const len = levenshtein(word, command);
        if (len <= threshold && len < data.min) data = { index, min: len };
      });
      if (data.index > -1) fixedWords[pos] = commandsList[data.index];
    });
    return fixedWords.join(' ');
  }
}
