import {IRasp} from "../DSTU/IRasp";

export class TextCompiler {
    public static Compile(rasp: IRasp[], mnemonic: string): string {
        let result =
            `Пары на ${mnemonic}\n\n`;

        rasp.forEach(lesson => {
            result += `
📌 ${lesson.pairNumber} пара
📕 ${lesson.type}: ${lesson.subject}
🏢 Аудитория: ${lesson.classRoom.corpus}-${lesson.classRoom.classRoom}\n`;
        });

        return result;
    }
}
