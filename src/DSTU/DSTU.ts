import Axios from "axios";
import {LessonObject} from "./LessonObject";
import LessonParser from "./LessonParser";
import {SchedulePair} from "./SchedulePair";
import {IRasp} from "./IRasp";

export default class DSTU {
    static async getRasp(date: Date): Promise<IRasp[]> {
        let dateString = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        let weekDay = date.getDay();

        let rasp = await Axios.get('https://edu.donstu.ru/api/Rasp?idGroup=40222&sdate=' + dateString);

        let lessons: Map<number, IRasp> = new Map<number, IRasp>();
        console.log(rasp.data)

        for (let lesson of rasp.data["data"]["rasp"]) {
            if (weekDay !== lesson["деньНедели"]) continue;

            let lessonObject: LessonObject = lesson;
            if (lessonObject.дисциплина.indexOf('Учебно-тренировочный') > -1) continue;

            // @ts-ignore
            lessons.set(SchedulePair[lessonObject.начало], LessonParser.Parse(lessonObject));
        }

        let ras: IRasp[] = [];

        lessons.forEach((lesson) => {
            ras.push(lesson);
        })


        return ras;
    }
}
