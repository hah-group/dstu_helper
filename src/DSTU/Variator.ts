import {IRasp} from "./IRasp";
import {RaspTypeMnemonic} from "./RaspTypeMnemonic";

export class Variator {
    public static Calc(lesson: IRasp) {
        let v = this.randomInt(0, 20);
        if (lesson.tutor.match(/Баранов/)) v += this.randomInt(25, 45);
        else if (lesson.tutor.match(/Рябых/)) v += 1000;
        else if (lesson.tutor.match(/Сагирьянц/)) v += this.randomInt(1, 10);
        else if (lesson.tutor.match(/Куликова/)) v += this.randomInt(1, 5);
        else if (lesson.tutor.match(/Шкиль/)) v += this.randomInt(20, 30);
        else if (lesson.tutor.match(/Болотова/)) v += this.randomInt(1, 10);
        else if (lesson.tutor.match(/Склярова/)) v += this.randomInt(20, 30);

        if (lesson.type === RaspTypeMnemonic.Lecture) v -= this.randomInt(0, 7);
        else if (lesson.type === RaspTypeMnemonic.Practical) v += this.randomInt(0, 15);
        else if (lesson.type === RaspTypeMnemonic.Laboratory) v += this.randomInt(8, 20);

        return v;
    }

    private static randomInt(min: number, max: number): number {
        let rand = min - 0.5 + Math.random() * (max - min + 1);
        return Math.round(rand);
    }
}
