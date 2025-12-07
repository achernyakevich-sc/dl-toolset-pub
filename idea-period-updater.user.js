// ==UserScript==
// @name         IdeaPeriodUpdater
// @namespace    https://github.com/achernyakevich-sc/dl-toolset-pub/
// @version      0.1.2
// @description  This script brings possibility to move forward period of the Idea tracker.
// @author       Alexander Chernyakevich <tch@scand.com>
// @include      /^https:\/\/mdt\..+/issues\/\d+/
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
        let startDateInput = document.getElementById("issue_start_date");
        let dueDateInput = document.getElementById("issue_due_date");
        let linkIssueCheckbox = document.getElementById("link_copy");
        let copyAttachmentsCheckbox = document.getElementById("copy_attachments");

        let oldPeriod = subjectInput.value.substr(0, 7);
        let year = parseInt(subjectInput.value.substr(0, 4));
        let month = parseInt(subjectInput.value.substr(5, 2)) + 1;
        if ( month > 12 ) {
            year++;
            month = month - 12;
        }
        let newPeriod = "" + year + "-" + ( month < 10 ? "0" : "" ) + month;
        subjectInput.value = subjectInput.value.replace(oldPeriod, newPeriod)

        descriptionTextarea.value = "";
        startDateInput.value = newPeriod + "-01";
        dueDateInput.value = newPeriod + "-25";
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

    let trackerSelect = document.getElementById("issue_tracker_id");
    let trackerTitle = trackerSelect.options[trackerSelect.selectedIndex].text;
    if (trackerTitle == "Idea") {
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

        GM_log("MDT-IdeaPeriodUpdater: shortcuts assigned");

        GM_registerMenuCommand("Updated period", updateForm, "p");
    }
})();
