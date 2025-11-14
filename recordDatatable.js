import { LightningElement, api } from 'lwc';

export default class RecordDatatable extends LightningElement {
    @api records = [];
    @api columns = [];

    get showFullScreen() {
        return this.records.length > 5;
    }

    get recordsToShow() {
        return this.showFullScreen ? this.records.slice(0, 5) : this.records;
    }

    viewFullScreen() {
        this.dispatchEvent(new CustomEvent('viewfullscreen'));
    }
}
