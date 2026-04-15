import type { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import type { FirebotViewer } from "@crowbartools/firebot-custom-scripts-types/types/modules/viewer-database";
import { firebot, logger } from "../main";

export interface AddUserToViewerDatabaseEffectModel {
    userId?: string;
    username?: string;
}

interface TwitchUserData {
    id: string;
    name: string;
    displayName: string;
    profilePictureUrl: string;
}

function sanitizeUsername(username?: string): string {
    if (!username) {
        return "";
    }

    const trimmed = username.trim();
    if (!trimmed) {
        return "";
    }

    return trimmed.startsWith("@") ? trimmed.slice(1) : trimmed;
}

function sanitizeUserId(userId?: string): string {
    if (!userId) {
        return "";
    }

    return userId.trim();
}

function usernamesMatch(
    inputUsername: string,
    resolvedUsername: string
): boolean {
    return inputUsername.toLowerCase() === resolvedUsername.toLowerCase();
}

interface TwitchUsersApi {
    getUserByName(username: string): Promise<TwitchUserData | null>;
    getUserById(userId: string): Promise<TwitchUserData | null>;
}

interface NewViewerPayload {
    id: string;
    username: string;
    displayName: string;
    profilePicUrl: string;
    twitchRoles: string[];
    online: boolean;
}

interface ViewerDatabaseApi {
    getViewerById(id: string): Promise<FirebotViewer | undefined>;
    getViewerByUsername(username: string): Promise<FirebotViewer | undefined>;
    createNewViewer(viewer: NewViewerPayload): Promise<FirebotViewer | undefined>;
}

export const addUserToViewerDatabaseEffect: Firebot.EffectType<AddUserToViewerDatabaseEffectModel> =
	{
	    definition: {
	        id: "firebot-mage-utils:addUserToViewerDatabase",
	        name: "Add User to Viewer Database",
	        description:
				"Add a Twitch user to the Firebot viewer database when missing.",
	        categories: ["advanced"],
	        icon: "fad fa-user-plus",
	        outputs: [
	            {
	                label: "User Previously Existed",
	                description:
						"Whether the user already existed in the database before this effect ran.",
	                defaultName: "userPreviouslyExisted"
	            },
	            {
	                label: "User Was Added",
	                description:
						"Whether the user was added to the database as a result of this effect (i.e. they did not previously exist).",
	                defaultName: "userWasAdded"
	            },
	            {
	                label: "Error Message",
	                description:
						"If the effect failed, an error message describing the failure.",
	                defaultName: "errorMessage"
	            }
	        ]
	    },
	    optionsTemplate: `
        <eos-container>
            <div style="font-style: italic; margin-bottom: 10px;">
                Provide at least one of the following to identify the Twitch user to add:
            </div>
            <eos-container header="User ID" pad-top="true">
                <div class="input-group">
                    <span class="input-group-addon" id="add-user-id-label">User ID</span>
                    <input
                        ng-model="effect.userId"
                        type="text"
                        class="form-control"
                        id="add-user-id"
                        aria-describedby="add-user-id-label"
                        placeholder="123456789"
                        replace-variables
                    >
                </div>
            </eos-container>
            <eos-container header="Username" pad-top="true">
                <div class="input-group">
                    <span class="input-group-addon" id="add-user-username-label">Username</span>
                    <input
                        ng-model="effect.username"
                        type="text"
                        class="form-control"
                        id="add-user-username"
                        aria-describedby="add-user-username-label"
                        placeholder="username or @username"
                        replace-variables
                    >
                </div>
            </eos-container>
        </eos-container>
    `,
	    optionsValidator: (effect) => {
	        const errors: string[] = [];
	        const username = effect.username ? effect.username.trim() : "";
	        const userId = effect.userId ? effect.userId.trim() : "";
	        if (!username && !userId) {
	            errors.push("User ID or username is required.");
	        }
	        return errors;
	    },
	    onTriggerEvent: async ({ effect }) => {
	        const username = sanitizeUsername(effect.username);
	        const userId = sanitizeUserId(effect.userId);
	        const { twitchApi } = firebot.modules;
	        const twitchUsers = twitchApi.users as TwitchUsersApi;

	        // Validate arguments
	        if (!username && !userId) {
	            logger.warn(
	                "add-user-to-viewer-database: No user ID or username provided."
	            );
	            return {
	                success: false,
	                errorMessage: "No user ID or username provided."
	            };
	        }

	        // Look up user in viewer database by all provided identifiers
	        const viewerDatabase = firebot.modules
	            .viewerDatabase as unknown as ViewerDatabaseApi;
	        let userRecordById: FirebotViewer | undefined;
	        let userRecordByUsername: FirebotViewer | undefined;

	        if (userId) {
	            userRecordById = await viewerDatabase.getViewerById(userId);
	        }
	        if (username) {
	            userRecordByUsername =
					await viewerDatabase.getViewerByUsername(username);
	        }

	        if (
	            userRecordById &&
				userRecordByUsername &&
				userRecordById._id !== userRecordByUsername._id
	        ) {
	            logger.warn(
	                `add-user-to-viewer-database: Provided user ID ${userId} and username ${username} matched different existing users (${userRecordById._id}, ${userRecordByUsername._id}).`
	            );
	            return {
	                success: false,
	                errorMessage:
						"Provided user ID and username matched different existing users."
	            };
	        }

	        const userRecord = userRecordById ?? userRecordByUsername;

	        if (userRecord) {
	            logger.debug(
	                `add-user-to-viewer-database: Lookup: id=${userId}, username=${username} - User already exists in viewer database (id=${userRecord._id}, username=${userRecord.username}).`
	            );
	            if (userId && userRecord._id !== userId) {
	                logger.warn(
	                    `add-user-to-viewer-database: Provided user ID ${userId} does not match existing user's ID ${userRecord._id}.`
	                );
	                return {
	                    success: false,
	                    errorMessage: "Provided user ID does not match existing user's ID."
	                };
	            }
	            if (username && !usernamesMatch(username, userRecord.username)) {
	                logger.warn(
	                    `add-user-to-viewer-database: Provided username ${username} does not match existing user's username ${userRecord.username}.`
	                );
	                return {
	                    success: false,
	                    errorMessage:
							"Provided username does not match existing user's username."
	                };
	            }
	            return {
	                success: true,
	                userWasAdded: false,
	                userPreviouslyExisted: true
	            };
	        }

	        // If user doesn't exist in viewer database, look up Twitch data to create new record
	        const twitchData = userId
	            ? await twitchUsers.getUserById(userId)
	            : await twitchUsers.getUserByName(username);

	        if (!twitchData) {
	            const lookupRef = userId || username;
	            logger.warn(
	                `add-user-to-viewer-database: Could not retrieve Twitch data for ${lookupRef}.`
	            );
	            return {
	                success: false,
	                errorMessage: "Could not retrieve Twitch data."
	            };
	        }

	        if (userId && twitchData.id !== userId) {
	            logger.warn(
	                `add-user-to-viewer-database: Provided user ID ${userId} does not match Twitch data ID ${twitchData.id}.`
	            );
	            return {
	                success: false,
	                errorMessage: "Provided user ID does not match Twitch data ID."
	            };
	        }

	        if (username && !usernamesMatch(username, twitchData.name)) {
	            logger.warn(
	                `add-user-to-viewer-database: Provided user ID ${userId} and username ${username} do not match Twitch data ID ${twitchData.id} and username ${twitchData.name}.`
	            );
	            return {
	                success: false,
	                errorMessage: "Provided user ID and username do not match."
	            };
	        }

	        const newUser = await viewerDatabase.createNewViewer({
	            id: twitchData.id,
	            username: twitchData.name,
	            displayName: twitchData.displayName,
	            profilePicUrl: twitchData.profilePictureUrl,
	            twitchRoles: [],
	            online: false
	        });
	        if (!newUser) {
	            logger.warn(
	                `add-user-to-viewer-database: Could not add user ${twitchData.name} to the database.`
	            );
	            return {
	                success: false,
	                errorMessage: "Could not add user to the database."
	            };
	        }

	        logger.info(
	            `add-user-to-viewer-database: User id=${twitchData.id}, username=${twitchData.name} added successfully (db id=${newUser._id}, db username=${newUser.username}).`
	        );
	        return {
	            success: true,
	            userWasAdded: true,
	            userPreviouslyExisted: false
	        };
	    }
	};
