import * as VssServices from "TFS/WorkItemTracking/Services";

export class BlockedWorkItemActionHandler {
	
        
        public execute(actionContext: any) {
        
                var webContext = VSS.getWebContext();
                VssServices.WorkItemFormNavigationService.getService(webContext).then((service: VssServices.IWorkItemFormNavigationService) => {
                        
                        var workItemType = "Impediment";
                        service.openNewWorkItem(workItemType, { 
                                "Title": "Blocked",
                                "Tags": "blocking", 
                                "System.AssignedTo": webContext.user.name,
                                "priority": 1
                                });
		});
	}
}