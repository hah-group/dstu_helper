import {IRasp} from "./IRasp";
import {RaspTypeMnemonic} from "./RaspTypeMnemonic";
import {IClassRoom} from "./IClassRoom";

export class Rasp implements IRasp {
    classRoom: IClassRoom | undefined;
    pairNumber: number | undefined;
    subject: String | undefined;
    type: RaspTypeMnemonic | undefined;
    tutor: String | undefined;
    probability: number | undefined;
    current: boolean;
    lessonEnd: Date;
    lessonStart: Date;
    isStarted: boolean;

    constructor() {

    }
}
