import { ShortNameLastnamePipe } from "./short-name-lastname.pipe";
import { User } from "../../models/user";
import { deepCopy } from "../functions/deepCopy";
import { adminTest } from "../../testing/models";

describe('ShortNameLastnamePipe', () => {
    // This pipe is a pure, stateless function so no need for BeforeEach
    let pipe = new ShortNameLastnamePipe();

    let userTest: User = deepCopy(adminTest);
    userTest.firstName = 'Luis Andres';
    userTest.lastName = 'Perez Gonzales';

    it('should shortNameSecondName', () => {
        expect(pipe.transform(userTest)).toEqual('Luis Perez Gonzales');
    });



});