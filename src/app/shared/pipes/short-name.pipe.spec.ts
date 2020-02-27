import { ShortNamePipe } from "./short-name.pipe";
import { User } from "../../models/user";
import { deepCopy } from "../functions/deepCopy";
import { adminTest } from "../../testing/models";

describe('ShortNamePipe', () => {
    // This pipe is a pure, stateless function so no need for BeforeEach
    let pipe = new ShortNamePipe();

    let userTest: User = deepCopy(adminTest);
    userTest.firstName = 'Luis Andres';
    userTest.lastName = 'Perez Gonzales';
    
    it('should shortName', () => {
        expect(pipe.transform(userTest)).toEqual('Luis Perez');
    });


});