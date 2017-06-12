import * as Actions from "./actions";

VSS.register("blockers-context-action", function (context) {
	return new Actions.BlockedWorkItemActionHandler();
});

VSS.notifyLoadSucceeded();