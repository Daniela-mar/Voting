public with sharing class LookupController {
    

        @AuraEnabled(cacheable=true)
         
            public static List<Voting_Campaign__c> search (String campName) {
                List<Voting_Campaign__c	> votingCampaign =  new List<Voting_Campaign__c	>();
                if(campName != ''){
                    String cName = '%' + campName + '%';
                    votingCampaign = [Select Id, Name From Voting_Campaign__c Where Name like:cName];
                    return votingCampaign;
                }
                return votingCampaign;
             }   
              
             }


