// ==UserScript==
// @name         LoW-Checker
// @version      0.2
// @description  List of Work (LoW) Checker
// @author       calina@scand.com
// @author       bosak@scand.com
// @include      /^https:\/\/.+\.ph.+us\.com\/issues\/\d+/
// @match        http://localhost:8080/*
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_registerMenuCommand
// @require      https://bitbucket.org/achernyakevich/tmsp-common/raw/configHelper-0.1.3/configHelper.js
// ==/UserScript==

(function () {
    "use strict";

    const CONFIG_NAMESPACE = "low-checker";
    const DEFAULT_CONFIG = JSON.stringify({
        targetElementMatchers: [
            {
                urlPattern: "http:\\/\\/localhost:",
                targetElementId: "text"
            },
            {
                urlPattern: "^https:\\/\\/.+\\.ph.+us\\.com\\/issues\\/\\d+",
                targetElementId: "issue_description"
            }
        ],
        blackListValidatorDictionary: []
    });

    const config = configHelper.getConfig(CONFIG_NAMESPACE);
    const stopWordsDictionary = [
        "fuck", "page", "crypto", "encryption"
    ].push(...config.blackListValidatorDictionary);
    const matcher = config.targetElementMatchers.find(el =>
        new RegExp(el.urlPattern).test(window.location.href)
    );
    const targetElementId = matcher.targetElementId;

    const VALIDATORS = {
        introductionValidator: function (line) {
            let introductions = [
                "- Development of the functionality ",
                "- Разработка функциональности "
            ];
            for (let i = 0; i < introductions.length; i++) {
                if (line.startsWith(introductions[i])) {
                    return true;
                }
            }
            return false;
        },
        endsWithValidator: function (line) {
            return line.endsWith(".");
        },
        blackListValidator: function (line) {
            for (let i = 0; i < stopWordsDictionary.length; i++) {
                if (line.includes(stopWordsDictionary[i])) {
                    return false;
                }
            }
            return true;
        }
    };

    const validate = (line) => {
        let failedValidations = [];
        for (let validatorName in VALIDATORS) {
            if (!VALIDATORS[validatorName](line)) {
                failedValidations.push(validatorName);
            }
        }
        return failedValidations;
    };

    const editLine = (failedValidations, line) => {
        let listOfValidation = "";
        for (let i = 0; i < failedValidations.length; i++) {
            listOfValidation += "\n\t" + failedValidations[i];
        }
        let message = "Failed:" + listOfValidation;
        return prompt(message, line);
    };

    const checkAndUpdateLoWText = (targetElementId) => () => {
        const loWTextArea = document.getElementById(targetElementId);
        const lines = loWTextArea.value.split("\n");

        let lineIndex = 0;
        for (; lineIndex < lines.length; lineIndex++) {
            const line = lines[lineIndex];

            if (line && line.trim().length) {
                const failedValidations = validate(line);

                if (failedValidations.length) {
                    let editedLine = editLine(failedValidations, line);
                    if (editedLine) {
                        loWTextArea.value = loWTextArea.value.replaceAll(
                            line,
                            editedLine
                        );
                    } else {
                        break;
                    }
                }
            }
        }

        if (lineIndex < lines.length) {
            const line = lines[lineIndex];
            loWTextArea.setSelectionRange(loWTextArea.value.indexOf(line), loWTextArea.value.indexOf(line) + line.length);
            loWTextArea.focus();

            alert(`LoW checking is cancelled.`);
        } else {
            alert(`LoW checking is completed.`);
        }
    };

    configHelper.addConfigMenu(CONFIG_NAMESPACE, DEFAULT_CONFIG);

    if (matcher) {
        document.addEventListener(
            "keydown",
            function (event) {
                // GM_log("Ctrl: " + event.ctrlKey +"; Shift: " + event.shiftKey + "; Key: " + event.key + "; Code: " + event.code);

                if (event.altKey && event.shiftKey && event.code == "KeyC") {
                    checkAndUpdateLoWText(targetElementId)();
                    event.stopPropagation();
                    event.preventDefault();
                }
            },
            true
        );

        GM_log("Shortcuts assigned");

        GM_registerMenuCommand("Check List of Works", checkAndUpdateLoWText(targetElementId), "c");
    } else {
        GM_log("LoW Checker: Configuration not found.");
    }
})();
