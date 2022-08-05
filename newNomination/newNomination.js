import { LightningElement, track, wire } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import NOMINATION_OBJECT from '@salesforce/schema/Nomination__c';
import Name_N from '@salesforce/schema/Nomination__c.Name';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import search from '@salesforce/apex/LookupController.search';


export default class NewNomination extends LightningElement {

    @track cName='';
    @track campaignList=[];
    @track objectApiName = 'Voting_Campaign__c';
    @track isShow = false;
    @track messageResult = false;
    @track showSearchedValues = false;
    @track isShowResult = true;
    @track campId;
    @wire(search, {campName: 'cName'})
    retrieveCampaigns ({error,data}) {
        this.messageResult = false;
        if(data) {
            console.log('data## ' + data.length);
            if(data.length>0 && this.isShowResult) {
               this.campaignList =data;
               this.showSearchedValues=true;
               this.messageResult=false;
            }           

    else if(data.length == 0) {
        this.campaignList=[];
        this.showSearchedValues=false;
        if(this.cName != ''){
           this.messageResult=true;
        }
    }
    else if(error){
        this.CampId='';
        this.cName='';
        this.campaignList=[];
        this.showSearchedValues=false;
        this.messageResult=true;
    }
}
}

searchHandleClick(event){
    this.isShowResult = true;
    this.messageResult = false;
  }

  searchHandleKeyChange(event){
    this.messageResult=false;
    this.cName = event.target.value;
    console.log(event);
  }

  parentHandleAction(event){        
    this.showSearchedValues = false;
    this.isShowResult = false;
    this.messageResult=false;
    this.campId =  event.target.dataset.value;
    this.cName =  event.target.dataset.label;      
    console.log('campId::'+this.campId);    
    const selectedEvent = new CustomEvent('selected', { detail: this.campId });
    this.dispatchEvent(selectedEvent);    
}


    @track eventRecord = {
        Name: ''
    };

    @track errors;

    handleChange(event) {
        let value = event.target.value;
        let name = event.target.name;
        this.eventRecord[name] = value;

    }


    handleLookup(event) {
        let selectedRecId = nomination.detail.selectedRecordId;
        let parentField = nomination.detail.parentfield;
        this.eventRecord[parentField] = selectedRecId;

    }

    handleClick() {
        const fields = {};
        fields[Name_N.fieldApiName] = this.eventRecord.Name;

        const eventRecord = { apiName: NOMINATION_OBJECT.objectApiName, fields };

        createRecord(eventRecord)
            .then((eventRec) => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Record Saved',
                    message: 'Nomination Draft is Ready',
                    variant: 'success'
                }));
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        actionName: "view",
                        recordId: eventRec.id
                    }
                });
            }).catch((err) => {
                this.errors = JSON.stringify(err);
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error Occured',
                    message: this.errors,
                    variant: 'error'
                }));
            });
    }

    handleCancel() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                actionName: "home",
                objectApiName: "Nomination__c"
            }
        });
    }

    




}

