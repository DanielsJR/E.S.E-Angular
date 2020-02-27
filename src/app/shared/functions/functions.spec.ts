import { User } from "../../models/user";
import { shortName, shortNameSecondName } from "./shortName";
import { adminTest, courseTest } from "../../testing/models";
import { deepCopy } from "./deepCopy";
import { Course } from "../../models/course";


describe('shortName functions', () => {
    let userTest: User = deepCopy(adminTest);
    userTest.firstName = 'Luis Andres';
    userTest.lastName = 'Perez Gonzales';
    it('should shortName', () => {
        expect(shortName(userTest)).toEqual('Luis Perez');
    });

    it('should shortNameSecondName', () => {
        expect(shortNameSecondName(userTest)).toEqual('Luis Perez Gonzales');
    });

});

describe('deep copy handles the 3 simple types, and null or undefined', () => {
    let courseTestCopy: Course = deepCopy(courseTest);

    it('should copy simple property', () => {
        expect(courseTestCopy.name).toEqual(courseTest.name);
        courseTestCopy.name = null;
        expect(courseTestCopy.name).not.toEqual(courseTest.name);
    });

    it('should copy array property', () => {
        expect(courseTestCopy.students).toEqual(courseTest.students);
        courseTestCopy.students = [];
        expect(courseTestCopy.students).not.toEqual(courseTest.students);
    });

    it('should copy object property', () => {
        expect(courseTestCopy.chiefTeacher).toEqual(courseTest.chiefTeacher);
        courseTestCopy.chiefTeacher = null;
        expect(courseTestCopy.chiefTeacher).not.toEqual(courseTest.chiefTeacher);
    });

    it('should copy date property', () => {
        let userTest: User = deepCopy(adminTest);
        let birthday = new BirthDay(userTest, new Date());
        let copyBirthday = deepCopy(birthday);
        expect(copyBirthday.birthday).toEqual(birthday.birthday);
        copyBirthday.birthday = null;
        expect(copyBirthday.birthday).not.toEqual(birthday.birthday);
        console.log(birthday.birthday);
    });

    class BirthDay {
        constructor(public user?: User, public birthday?: Date) { };
    }

    it('should handle undefined', () => {
        let objUndefined;
        let objCopy = deepCopy(objUndefined);
        expect(objCopy).toEqual(undefined);
    });

    it('should handle null', () => {
        let objNull = null;
        let objCopy = deepCopy(objNull);
        expect(objCopy).toEqual(null);
    });



});

