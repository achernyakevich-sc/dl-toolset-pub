// ==UserScript==
// @name         TrackerPeriodUpdater
// @namespace    https://github.com/achernyakevich-sc/dl-toolset-pub/
// @version      0.1.0
// @description  This script brings possibility to move forward period of the tracker.
// @author       Alexander Chernyakevich <tch@scand.com>
// @include      /^https:\/\/.+\.ph.+us\.com\/issues\/\d+/
// @match        https://reports.phoebius.com/*/issues/*/copy
// @grant        GM_log
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';

    const updatePeriod = () => {
        let periodInput = document.getElementById("issue_custom_field_values_18");
        let subjectInput = document.getElementById("issue_subject");
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
        GM_log("Update called");
    }

    document.addEventListener("keydown", (event) => {
            // GM_log("Ctrl: " + event.ctrlKey +"; Shift: " + event.shiftKey + "; Key: " + event.key + "; Code: " + event.code);

            if (event.altKey && event.shiftKey && event.code == "KeyP") {
                GM_log("pressed");
                updatePeriod();
                event.stopPropagation();
                event.preventDefault();
            }
        }, true);

    GM_log("Shortcuts assigned");

    GM_registerMenuCommand("Updated period", updatePeriod, "u");
})();
