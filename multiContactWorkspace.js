import { LightningElement, track, api } from 'lwc';
import searchContacts from '@salesforce/apex/MultiContactController.searchContacts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'; // ✅ built-in toast event

const DEBOUNCE_DELAY = 300;

export default class MultiContactSearch extends LightningElement {
  @track searchTerm = '';
  @track searchResults = [];
  @track selectedContacts = []; // {Id, Name, MobilePhone}
  showDropdown = false;
  debounceTimer;

  // limit of 10 contacts
  maxSelect = 10;

  handleInput(event) {
    this.searchTerm = event.target.value;
    this.debouncedSearch(this.searchTerm);
  }

  handleKeyUp(event) {
    if (this.searchTerm && this.searchTerm.length >= 2) {
      this.showDropdown = true;
    } else {
      this.showDropdown = false;
    }
  }

  debouncedSearch(term) {
    window.clearTimeout(this.debounceTimer);
    this.debounceTimer = window.setTimeout(() => {
      this.performSearch(term);
    }, DEBOUNCE_DELAY);
  }

  performSearch(term) {
    if (!term || term.trim().length < 2) {
      this.searchResults = [];
      this.showDropdown = false;
      return;
    }

    searchContacts({ query: term })
      .then(res => {
        const selectedIds = new Set(this.selectedContacts.map(sc => sc.Id));
        this.searchResults = res.map(c => {
          return { ...c, selected: selectedIds.has(c.Id) };
        });
        this.showDropdown = true;
      })
      .catch(error => {
        this.searchResults = [];
        this.showDropdown = false;
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Error',
            message: (error.body && error.body.message) || error.message,
            variant: 'error'
          })
        );
      });
  }

  toggleContact(e) {
    const id = e.target.value;
    const found = this.searchResults.find(s => s.Id === id);
    if (!found) return;

    if (e.target.checked) {
      if (this.selectedContacts.length >= this.maxSelect) {
        e.target.checked = false;
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Limit Reached',
            message: 'Maximum 10 contacts allowed',
            variant: 'warning'
          })
        );
        return;
      }
      this.selectedContacts = [...this.selectedContacts, { Id: found.Id, Name: found.Name, MobilePhone: found.MobilePhone }];
    } else {
      this.selectedContacts = this.selectedContacts.filter(sc => sc.Id !== id);
    }

    this.searchResults = this.searchResults.map(s => s.Id === id ? { ...s, selected: e.target.checked } : s);
  }

  removeContact(e) {
    const id = e.currentTarget.dataset.id;
    this.selectedContacts = this.selectedContacts.filter(sc => sc.Id !== id);
    this.searchResults = this.searchResults.map(s => s.Id === id ? { ...s, selected: false } : s);
  }

  clearSelection() {
    this.selectedContacts = [];
    this.searchResults = this.searchResults.map(s => ({ ...s, selected: false }));
  }

  confirmSelection() {
    if (!this.selectedContacts || this.selectedContacts.length === 0) {
      this.dispatchEvent(
        new ShowToastEvent({
          title: 'No Contacts Selected',
          message: 'Please select at least one contact before confirming',
          variant: 'warning'
        })
      );
      return;
    }

    const selectedIds = this.selectedContacts.map(sc => sc.Id);
    this.dispatchEvent(new CustomEvent('confirm', { detail: { selectedIds, contacts: this.selectedContacts } }));
  }

  get searchResultsEmpty() {
    return this.searchResults && this.searchResults.length === 0;
  }
}
