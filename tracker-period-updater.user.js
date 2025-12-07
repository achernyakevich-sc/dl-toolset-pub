// ==UserScript==
// @name         TrackerPeriodUpdater
// @namespace    https://github.com/achernyakevich-sc/dl-toolset-pub/
// @version      0.1.5
// @description  This script brings possibility to move forward period of the tracker.
// @author       Alexander Chernyakevich <tch@scand.com>
// @include      /^https:\/\/.+\.ph.+us\.com\/(.+\/)*issues\/\d+(\/copy)*/
// @grant        GM_log
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';

    const updateForm = () => {
        let subjectInput = document.getElementById("issue_subject");
        let descriptionTextarea = document.getElementById("issue_description");
        let statusSelect = document.getElementById("issue_status_id");
        let assigneeSelect = document.getElementById("issue_assigned_to_id");
        let periodInput = document.getElementById(periodInputId);
        let linkIssueCheckbox = document.getElementById("link_copy");
        let copyAttachmentsCheckbox = document.getElementById("copy_attachments");

        let oldPeriod = parseInt(periodInput.value);
        let year = Math.floor(oldPeriod / 100);
        let month = (oldPeriod % 100) + 1;
        if ( month > 12 ) {
            year++;
            month = month - 12;
        }
        let newPeriod = "" + year + ( month < 10 ? "0" : "" ) + month;
        periodInput.value = newPeriod;
        subjectInput.value = subjectInput.value.replace(oldPeriod, newPeriod)

        if ( !isReportsHost ) {
            document.getElementById("issue_custom_field_values_5").value = ""; // Report field
            document.getElementById("issue_custom_field_values_8").value = ""; // Issuing Date field
            document.getElementById("issue_custom_field_values_7").value = ""; // Payment Date field
            // Recorded field: Scand -> No | SCPL -> unselected
            document.getElementById("issue_custom_field_values_17").selectedIndex =
              ( document.getElementById("issue_custom_field_values_16").value == "Scand" ? 2 : 0);

            let numberInput = document.getElementById("issue_custom_field_values_6");
            numberInput.value = ( numberInput.value.trim() != "" ? parseInt(numberInput.value) + 1 : "" );
        }

        descriptionTextarea.value = "";
        if ( linkIssueCheckbox ) {
            linkIssueCheckbox.checked = false;
        }
        if ( copyAttachmentsCheckbox ) {
            copyAttachmentsCheckbox.checked = false;
        }
        assigneeSelect.selectedIndex = 1;
        statusSelect.selectedIndex = 0;

        GM_log("Form updated.");
    }

    let isReportsHost = ( document.location.hostname.indexOf("reports") == 0 );
    let periodInputId = ( isReportsHost ? "issue_custom_field_values_18" : "issue_custom_field_values_4" );

    document.addEventListener("keydown", (event) => {
            // GM_log("Ctrl: " + event.ctrlKey +"; Shift: " + event.shiftKey + "; Key: " + event.key + "; Code: " + event.code);

            if (event.altKey && event.shiftKey && event.code == "KeyP" && !event.ctrlKey) {
                if (document.location.pathname.indexOf("/copy") >= 0 || document.getElementById("update").style.display != "none") {
                    updateForm();
                }
                event.stopPropagation();
                event.preventDefault();
            }
        }, true);

    GM_log("TrackerPeriodUpdater: shortcuts assigned");

    GM_registerMenuCommand("Updated period", updateForm, "p");
})();
