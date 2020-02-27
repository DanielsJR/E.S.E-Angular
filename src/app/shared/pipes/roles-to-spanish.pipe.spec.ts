import { RolesToSpanishPipe } from "./roles-to-spanish.pipe";
import { User } from "../../models/user";
import { deepCopy } from "../functions/deepCopy";
import { adminTest } from "../../testing/models";
import { ROLE_ADMIN_SPANISH, ROLE_ADMIN, ROLE_MANAGER, ROLE_MANAGER_SPANISH } from "../../app.config";

describe('RolesToSpanishPipe', () => {
    // This pipe is a pure, stateless function so no need for BeforeEach
    let pipe = new RolesToSpanishPipe();

    let userTest: User = deepCopy(adminTest);
    userTest.roles = [ROLE_ADMIN, ROLE_MANAGER];

    it('should return user roles in spanish', () => {
        expect(pipe.transform(userTest.roles)).toEqual(ROLE_ADMIN_SPANISH + ', ' + ROLE_MANAGER_SPANISH);
    });

});