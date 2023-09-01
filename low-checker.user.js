// ==UserScript==
// @name         LoW-Checker
// @version      0.1
// @description  List of Work (LoF) Checker
// @author       calina@scand.com
// @author       bosak@scand.com
// @match        http://localhost:8080/
// @grant        GM_log
// ==/UserScript==

(function () {
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

    window.Validator = {
        extractAndValidate: function () {
            validate(document.getElementById(TEXTAREA_ID).value);
        },
        addButtons: function () {
            const root = document.getElementById("root");
            var checkButton = document.createElement("button");
            checkButton.innerHTML = 'Validate';
            checkButton.onclick = window.Validator.extractAndValidate;
            root.appendChild(checkButton);
        },
        init: function () {
            this.addButtons();
        }
    }

    window.Validator.init();
})();
