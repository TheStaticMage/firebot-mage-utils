import { firebot } from "../main";
import { addUserToViewerDatabaseEffect } from "./add-user-to-viewer-database";

export function registerEffects() {
    const { effectManager } = firebot.modules;
    effectManager.registerEffect(addUserToViewerDatabaseEffect);
}
