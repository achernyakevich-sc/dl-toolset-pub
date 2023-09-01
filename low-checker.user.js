// ==UserScript==
// @name         LoW-Checker
// @version      0.1
// @description  List of Work (LoF) Checker
// @author       calina@scand.com
// @author       bosak@scand.com
// @match        http://localhost:8080/
// @grant        GM_log
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
  'use strict';
    const TEXTAREA_ID = "text";
    const VALIDATORS = {
        beginsWithValidator: function (brief) {
            return brief.startsWith("- ");
        },
        endsWithValidator: function (brief) {
            return brief.endsWith(".");
        },
        intoductionValidator: function (brief) {
            let introductions = ["Development of functionality", "Разработка функциональности"];
            for (let i = 0; i < introductions.length; i++) {
                if (brief.slice(2).startsWith(introductions[i])) {
                    return true;
                }
            }
            return false;
        },
        blackListValidator: function (brief) {
            let dictionary = ["fuck"];
            for (let i = 0; i < dictionary.length; i++) {
                if (brief.includes(dictionary[i])) {
                    return false;
                }
            }
            return true;
        }
    }

   const validate = (text) => {
        var lines = text.split('\n');
        lines.forEach((line, index) => {
            if (line.replace(/^\s*$(?:\r\n?|\n)/gm, "").length > 0) {
                Object.keys(VALIDATORS).forEach(validator => {
                    let result = VALIDATORS[validator](line);
                    if (!result) {
                        alert(`${validator} failed in line ${index + 1}`);
                    }
                });
            }
        })
    }

   document.addEventListener('keydown', function(event) {
            //GM_log("Ctrl: " + event.ctrlKey +"; Shift: " + event.shiftKey + "; Key: " + event.key + "; Code: " + event.code);

            // Ctrl+Shift+? -> Toggle Search Panel (if available)
            // Ctrl+Shift+/ -> Toggle Full Screen mode
            if ( event.altKey && event.shiftKey && event.code == 'KeyC') {
                window.Validator.extractAndValidate();
                event.stopPropagation();
                event.preventDefault();
            }

        }, true);
    GM_log("Shortcuts aassigned");

   window.Validator = {
        extractAndValidate: function () {
            validate(document.getElementById(TEXTAREA_ID).value);
        }
    }

    GM_registerMenuCommand("Check briefs", window.Validator.extractAndValidate, 'KeyC');
})();


