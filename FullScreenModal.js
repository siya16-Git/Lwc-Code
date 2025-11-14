import { LightningElement, api } from 'lwc';

export default class FullScreenModal extends LightningElement {
    @api records = [];
    @api title;
    @api columns = [];

    closeModal() {
        this.dispatchEvent(new CustomEvent('closemodal'));
    }
}
