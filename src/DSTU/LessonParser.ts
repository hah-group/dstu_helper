import {LessonObject} from "./LessonObject";
import {LessonType} from "./LessonType";
import {SchedulePair} from "./SchedulePair";
import {Rasp} from "./Rasp";
import {IRasp} from "./IRasp";
import {RaspTypeMnemonic} from "./RaspTypeMnemonic";
import {Variator} from "./Variator";

export default class LessonParser {
    static Parse(lessonObject: LessonObject) {
        let rasp: IRasp = new Rasp();
        this._subjectParse(lessonObject.дисциплина, rasp);
        this._classroomParse(lessonObject.аудитория, rasp);
        this._parsePair(lessonObject.начало, rasp);
        rasp.tutor = lessonObject.преподаватель;
        rasp.probability = Variator.Calc(rasp);
        rasp.lessonStart = new Date(lessonObject.датаНачала);
        rasp.lessonEnd = new Date(lessonObject.датаОкончания);
        rasp.current = this.isCurrent(rasp.lessonStart, rasp.lessonEnd);
        rasp.isStarted = this.isStarted(rasp.lessonStart, rasp.lessonEnd);

        return rasp;
    }


    static _subjectParse(subject: string, rasp: IRasp) {
        subject.replace(/\(.*\)/ig, "");
        let subjectParsed = subject.match(/([а-я .]{2,3} )([а-я \-]*)/i);
        if (!subjectParsed) return;

        switch (subjectParsed[1]) {
            case LessonType.Lecture:
                rasp.type = RaspTypeMnemonic.Lecture;
                break;
            case LessonType.Practical:
                rasp.type = RaspTypeMnemonic.Practical;
                break;
            case LessonType.Laboratory:
                rasp.type = RaspTypeMnemonic.Laboratory;
                break;
        }

        rasp.subject = subjectParsed[2];
    }

    static _classroomParse(classRoom: string, rasp: IRasp) {
        classRoom.replace(/\(.*\)/ig, "");
        let classroomParsed = classRoom.match(/([\d а-я]*)[- ]([\d а-я]*)/i);
        if (!classroomParsed) return;

        if (parseInt(classroomParsed[1]))
            rasp.classRoom = {
                corpus: classroomParsed[1],
                classRoom: classroomParsed[2],
                distance: false
            }

        else if (classroomParsed[1].toLowerCase() === "до")
            rasp.classRoom = {
                corpus: null,
                classRoom: null,
                distance: true
            }

        else
            rasp.classRoom = {
                corpus: classroomParsed[1],
                classRoom: null,
                distance: false
            }
    }

    static _parsePair(startPair: string, rasp: IRasp) {
        // @ts-ignore
        rasp.pairNumber = SchedulePair[startPair];
    }

    private static isCurrent(dateStart: Date, dateEnd: Date): boolean {
        const currentDate = new Date().getTime() + 10800000;
        if (currentDate <= dateEnd.getTime() && currentDate >= dateStart.getTime()) return true;
        else if ((currentDate + 900000) <= dateEnd.getTime() && (currentDate + 900000) >= dateStart.getTime()) return true;
        return false;
    }

    private static isStarted(dateStart: Date, dateEnd: Date): boolean {
        const currentDate = new Date().getTime() + 10800000;
        return currentDate <= dateEnd.getTime() && currentDate >= dateStart.getTime();

    }
}
