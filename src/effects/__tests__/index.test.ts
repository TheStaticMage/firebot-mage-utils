import * as mainModule from "../../main";
import { addUserToViewerDatabaseEffect } from "../add-user-to-viewer-database";
import { registerEffects } from "../index";

describe("effects registration", () => {
    it("registers the Add User to Viewer Database effect", () => {
        const registerEffect = jest.fn();
        const mutableMain = mainModule as any;
        mutableMain.firebot = {
            modules: {
                effectManager: {
                    registerEffect
                }
            }
        };

        registerEffects();

        expect(registerEffect).toHaveBeenCalledWith(addUserToViewerDatabaseEffect);
    });
});
