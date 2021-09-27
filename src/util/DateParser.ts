const MNEMONIC_REGEX = /(завтра|послезавтра|понедельник|пн|вторник|вт|среду|ср|четверг|чт|пятницу|пт|субботу|сб|воскресенье|вс)(?= |$)/ig;

export class DateParser {
    public static Parse(message: string): {
        mnemonic: string,
        date: Date
    } {
        let dateMnemonic = '';
        const mnemonicMatches = message.match(MNEMONIC_REGEX);
        if (mnemonicMatches) {
            dateMnemonic = mnemonicMatches[0];
        }

        return {
            mnemonic: dateMnemonic !== '' ? dateMnemonic : 'сегодня',
            date: this.dateFromMnemonic(dateMnemonic)
        }
    }

    private static dateFromMnemonic(mnemonic: string): Date {
        const date = new Date();
        if (mnemonic === '') return date;

        const weekDay = this.weekParser(mnemonic);
        if (weekDay > -1) {
            if (date.getDay() > weekDay) date.setDate(date.getDate() + (7 - date.getDay() + weekDay));
            else if (date.getDay() < weekDay) date.setDate(date.getDate() + (weekDay - date.getDay()));
            else date.setDate(date.getDate() + 7)
        }

        const relativeAdd = this.relativeAdd(mnemonic);
        if (relativeAdd > 0)
            date.setDate(date.getDate() + relativeAdd);

        return date;
    }

    private static relativeAdd(mnemonic: string): number {
        if (mnemonic.match(/(послезавтра)(?= |$)/ig)) return 2;
        else if (mnemonic.match(/(завтра)(?= |$)/ig)) return 1;
        else return 0;
    }

    private static weekParser(mnemonic: string): number {
        if (mnemonic.match(/(понедельник|пн)(?= |$)/ig)) return 1;
        else if (mnemonic.match(/(вторник|вт)(?= |$)/ig)) return 2;
        else if (mnemonic.match(/(среду|ср)(?= |$)/ig)) return 3;
        else if (mnemonic.match(/(четверг|чт)(?= |$)/ig)) return 4;
        else if (mnemonic.match(/(пятницу|пт)(?= |$)/ig)) return 5;
        else if (mnemonic.match(/(субботу|сб)(?= |$)/ig)) return 6;
        else if (mnemonic.match(/(воскресенье|вс)(?= |$)/ig)) return 0;
        else return -1;
    }
}
