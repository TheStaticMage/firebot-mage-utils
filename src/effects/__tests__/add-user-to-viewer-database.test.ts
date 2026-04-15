import * as mainModule from "../../main";
import { addUserToViewerDatabaseEffect } from "../add-user-to-viewer-database";

const logger = {
	info: jest.fn(),
	warn: jest.fn(),
	error: jest.fn(),
	debug: jest.fn(),
};

const twitchApi = {
	users: {
		getUserByName: jest.fn(),
		getUserById: jest.fn(),
	},
};

const viewerDatabase = {
	getViewerById: jest.fn(),
	getViewerByUsername: jest.fn(),
	createNewViewer: jest.fn(),
};

describe("Add User to Viewer Database effect", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		const mutableMain = mainModule as any;
		mutableMain.logger = logger;
		mutableMain.firebot = {
			modules: {
				twitchApi,
				viewerDatabase,
			},
		};
	});

	it("fails validation when both user ID and username are missing", () => {
		const validator = addUserToViewerDatabaseEffect.optionsValidator;
		expect(validator).toBeDefined();
		if (!validator) {
			throw new Error("Expected optionsValidator to be defined.");
		}
		const errors = validator({} as never);

		expect(errors).toEqual(["User ID or username is required."]);
	});

	it("passes validation when a user identifier is provided", () => {
		const validator = addUserToViewerDatabaseEffect.optionsValidator;
		expect(validator).toBeDefined();
		if (!validator) {
			throw new Error("Expected optionsValidator to be defined.");
		}

		const errors = validator({ username: "viewername" } as never);

		expect(errors).toEqual([]);
	});

	it("fails when both user ID and username are missing", async () => {
		const result = (await addUserToViewerDatabaseEffect.onTriggerEvent({
			effect: {},
		} as never)) as any;

		expect(result.success).toBe(false);
		expect(result.errorMessage).toBe("No user ID or username provided.");
	});

	it("uses user ID when username is omitted", async () => {
		viewerDatabase.getViewerById.mockResolvedValue(undefined);
		twitchApi.users.getUserById.mockResolvedValue({
			id: "12345",
			name: "viewername",
			displayName: "ViewerName",
			profilePictureUrl: "https://example.com/avatar.png",
		});
		viewerDatabase.createNewViewer.mockResolvedValue({
			_id: "12345",
			username: "viewername",
		});

		const result = (await addUserToViewerDatabaseEffect.onTriggerEvent({
			effect: { userId: "12345" },
		} as never)) as any;

		expect(viewerDatabase.getViewerById).toHaveBeenCalledWith("12345");
		expect(twitchApi.users.getUserById).toHaveBeenCalledWith("12345");
		expect(twitchApi.users.getUserByName).not.toHaveBeenCalled();
		expect(viewerDatabase.createNewViewer).toHaveBeenCalledWith({
			id: "12345",
			username: "viewername",
			displayName: "ViewerName",
			profilePicUrl: "https://example.com/avatar.png",
			twitchRoles: [],
			online: false,
		});
		expect(result.success).toBe(true);
		expect(result.userWasAdded).toBe(true);
		expect(result.userPreviouslyExisted).toBe(false);
	});

	it("fails when provided user ID and username do not match", async () => {
		viewerDatabase.getViewerById.mockResolvedValue(undefined);
		twitchApi.users.getUserById.mockResolvedValue({
			id: "12345",
			name: "differentname",
			displayName: "DifferentName",
			profilePictureUrl: "https://example.com/avatar.png",
		});

		const result = (await addUserToViewerDatabaseEffect.onTriggerEvent({
			effect: { userId: "12345", username: "@viewername" },
		} as never)) as any;

		expect(viewerDatabase.getViewerById).toHaveBeenCalledWith("12345");
		expect(twitchApi.users.getUserById).toHaveBeenCalledWith("12345");
		expect(result.success).toBe(false);
		expect(result.errorMessage).toBe(
			"Provided user ID and username do not match.",
		);
		expect(viewerDatabase.createNewViewer).not.toHaveBeenCalled();
	});

	it("normalizes @ prefix and adds a new user", async () => {
		viewerDatabase.getViewerByUsername.mockResolvedValue(undefined);
		twitchApi.users.getUserByName.mockResolvedValue({
			id: "12345",
			name: "viewername",
			displayName: "ViewerName",
			profilePictureUrl: "https://example.com/avatar.png",
		});
		viewerDatabase.createNewViewer.mockResolvedValue({
			_id: "12345",
			username: "viewername",
		});

		const result = (await addUserToViewerDatabaseEffect.onTriggerEvent({
			effect: { username: "@viewername" },
		} as never)) as any;

		expect(viewerDatabase.getViewerByUsername).toHaveBeenCalledWith(
			"viewername",
		);
		expect(twitchApi.users.getUserByName).toHaveBeenCalledWith("viewername");
		expect(viewerDatabase.createNewViewer).toHaveBeenCalledWith({
			id: "12345",
			username: "viewername",
			displayName: "ViewerName",
			profilePicUrl: "https://example.com/avatar.png",
			twitchRoles: [],
			online: false,
		});
		expect(result.success).toBe(true);
		expect(result.userWasAdded).toBe(true);
		expect(result.userPreviouslyExisted).toBe(false);
	});

	it("returns success when user already exists", async () => {
		viewerDatabase.getViewerByUsername.mockResolvedValue({
			_id: "12345",
			username: "viewername",
		});

		const result = (await addUserToViewerDatabaseEffect.onTriggerEvent({
			effect: { username: "viewername" },
		} as never)) as any;

		expect(viewerDatabase.getViewerByUsername).toHaveBeenCalledWith(
			"viewername",
		);
		expect(twitchApi.users.getUserByName).not.toHaveBeenCalled();
		expect(result.success).toBe(true);
		expect(result.userPreviouslyExisted).toBe(true);
		expect(result.userWasAdded).toBe(false);
		expect(viewerDatabase.createNewViewer).not.toHaveBeenCalled();
	});

	it("returns success when username lookup finds an existing user for provided ID and username", async () => {
		viewerDatabase.getViewerById.mockResolvedValue(undefined);
		viewerDatabase.getViewerByUsername.mockResolvedValue({
			_id: "12345",
			username: "viewername",
		});

		const result = (await addUserToViewerDatabaseEffect.onTriggerEvent({
			effect: { userId: "12345", username: "viewername" },
		} as never)) as any;

		expect(viewerDatabase.getViewerById).toHaveBeenCalledWith("12345");
		expect(viewerDatabase.getViewerByUsername).toHaveBeenCalledWith(
			"viewername",
		);
		expect(twitchApi.users.getUserById).not.toHaveBeenCalled();
		expect(twitchApi.users.getUserByName).not.toHaveBeenCalled();
		expect(viewerDatabase.createNewViewer).not.toHaveBeenCalled();
		expect(result.success).toBe(true);
		expect(result.userPreviouslyExisted).toBe(true);
		expect(result.userWasAdded).toBe(false);
	});

	it("fails when provided user ID and username match different existing users", async () => {
		viewerDatabase.getViewerById.mockResolvedValue({
			_id: "12345",
			username: "viewername",
		});
		viewerDatabase.getViewerByUsername.mockResolvedValue({
			_id: "98765",
			username: "otherviewer",
		});

		const result = (await addUserToViewerDatabaseEffect.onTriggerEvent({
			effect: { userId: "12345", username: "otherviewer" },
		} as never)) as any;

		expect(result.success).toBe(false);
		expect(result.errorMessage).toBe(
			"Provided user ID and username matched different existing users.",
		);
		expect(twitchApi.users.getUserById).not.toHaveBeenCalled();
		expect(twitchApi.users.getUserByName).not.toHaveBeenCalled();
		expect(viewerDatabase.createNewViewer).not.toHaveBeenCalled();
	});

	it("fails when provided user ID does not match an existing user's ID", async () => {
		viewerDatabase.getViewerById.mockResolvedValue(undefined);
		viewerDatabase.getViewerByUsername.mockResolvedValue({
			_id: "99999",
			username: "viewername",
		});

		const result = (await addUserToViewerDatabaseEffect.onTriggerEvent({
			effect: { userId: "12345", username: "viewername" },
		} as never)) as any;

		expect(result.success).toBe(false);
		expect(result.errorMessage).toBe(
			"Provided user ID does not match existing user's ID.",
		);
		expect(twitchApi.users.getUserById).not.toHaveBeenCalled();
		expect(twitchApi.users.getUserByName).not.toHaveBeenCalled();
		expect(viewerDatabase.createNewViewer).not.toHaveBeenCalled();
	});

	it("fails when provided username does not match an existing user's username", async () => {
		viewerDatabase.getViewerById.mockResolvedValue({
			_id: "12345",
			username: "viewername",
		});
		viewerDatabase.getViewerByUsername.mockResolvedValue(undefined);

		const result = (await addUserToViewerDatabaseEffect.onTriggerEvent({
			effect: { userId: "12345", username: "differentname" },
		} as never)) as any;

		expect(result.success).toBe(false);
		expect(result.errorMessage).toBe(
			"Provided username does not match existing user's username.",
		);
		expect(twitchApi.users.getUserById).not.toHaveBeenCalled();
		expect(twitchApi.users.getUserByName).not.toHaveBeenCalled();
		expect(viewerDatabase.createNewViewer).not.toHaveBeenCalled();
	});

	it("fails when twitch data cannot be retrieved", async () => {
		viewerDatabase.getViewerByUsername.mockResolvedValue(undefined);
		twitchApi.users.getUserByName.mockResolvedValue(null);

		const result = (await addUserToViewerDatabaseEffect.onTriggerEvent({
			effect: { username: "viewername" },
		} as never)) as any;

		expect(viewerDatabase.getViewerByUsername).toHaveBeenCalledWith(
			"viewername",
		);
		expect(result.success).toBe(false);
		expect(result.errorMessage).toBe("Could not retrieve Twitch data.");
	});

	it("fails when provided user ID does not match Twitch data ID", async () => {
		viewerDatabase.getViewerById.mockResolvedValue(undefined);
		twitchApi.users.getUserById.mockResolvedValue({
			id: "54321",
			name: "viewername",
			displayName: "ViewerName",
			profilePictureUrl: "https://example.com/avatar.png",
		});

		const result = (await addUserToViewerDatabaseEffect.onTriggerEvent({
			effect: { userId: "12345" },
		} as never)) as any;

		expect(result.success).toBe(false);
		expect(result.errorMessage).toBe(
			"Provided user ID does not match Twitch data ID.",
		);
		expect(viewerDatabase.createNewViewer).not.toHaveBeenCalled();
	});

	it("fails when creating a new viewer returns no user", async () => {
		viewerDatabase.getViewerByUsername.mockResolvedValue(undefined);
		twitchApi.users.getUserByName.mockResolvedValue({
			id: "12345",
			name: "viewername",
			displayName: "ViewerName",
			profilePictureUrl: "https://example.com/avatar.png",
		});
		viewerDatabase.createNewViewer.mockResolvedValue(undefined);

		const result = (await addUserToViewerDatabaseEffect.onTriggerEvent({
			effect: { username: "viewername" },
		} as never)) as any;

		expect(result.success).toBe(false);
		expect(result.errorMessage).toBe("Could not add user to the database.");
	});
});
