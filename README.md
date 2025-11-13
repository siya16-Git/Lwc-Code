multiContactWorkspace.html
<template>
  <lightning-card title="Search Contacts">
    <div class="slds-p-around_medium">
      <lightning-input type="text" label="Search by Name or Mobile" placeholder="Start typing..."
                       value={searchTerm}
                       onchange={handleInput}
                       onkeyup={handleKeyUp}>
      </lightning-input>

      <template if:true={showDropdown}>
        <div class="slds-dropdown slds-dropdown_length-5 slds-dropdown_fluid" role="listbox">
          <ul class="slds-listbox slds-listbox_vertical" role="presentation">
            <template for:each={searchResults} for:item="c">
              <li key={c.Id} class="slds-listbox__item" role="presentation">
                <label class="slds-checkbox">
                  <input type="checkbox" name="selectContact" value={c.Id} onchange={toggleContact} checked={c.selected}/>
                  <span class="slds-checkbox_faux"></span>
                  <!--span class="slds-form-element__label">{c.Name} {(c.MobilePhone ? ' - ' + c.MobilePhone : '')}</span-->
                </label>
              </li>
            </template>
            <template if:true={searchResultsEmpty}>
              <li class="slds-listbox__item">No contacts found</li>
            </template>
          </ul>
        </div>
      </template>

      <!-- Selected pills -->
      <div class="slds-m-top_small slds-pill_container">
        <template for:each={selectedContacts} for:item="sc">
          <span key={sc.Id} class="slds-pill slds-pill_link" title={sc.Name}>
            <span class="slds-pill__label">{sc.Name}</span>
            <button class="slds-button slds-button_icon slds-pill__remove" data-id={sc.Id} onclick={removeContact}>
              <lightning-icon icon-name="utility:close" size="x-small"></lightning-icon>
            </button>
          </span>
        </template>
      </div>

      <div class="slds-m-top_medium">
        <lightning-button variant="brand" label="Confirm Selection" onclick={confirmSelection}></lightning-button>
        <lightning-button variant="neutral" label="Clear" onclick={clearSelection} class="slds-m-left_small"></lightning-button>
      </div>
    </div>
  </lightning-card>
</template>
--------------------------------------------------------------------------------------------------
