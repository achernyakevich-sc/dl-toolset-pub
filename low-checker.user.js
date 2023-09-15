// ==UserScript==
// @name         LoW-Checker
// @version      0.1
// @description  List of Work (LoW) Checker
// @author       calina@scand.com
// @author       bosak@scand.com
// @match        http://localhost:8080/*
// @match        https://*.phoebius.com/issues/*
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_listValues
// @require      https://bitbucket.org/achernyakevich/tampermonkey-scripts/raw/configHelper-0.1.1/common/configHelper.js
// ==/UserScript==

(function() {
    'use strict';

    const VALIDATORS = {
        intoductionValidator: function (line) {
            let introductions = ["- Development of the functionality ", "- Разработка функциональности "];
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
            let dictionary = ["fuck"];
            for (let i = 0; i < dictionary.length; i++) {
                if (line.includes(dictionary[i])) {
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

    const extractAndValidate = (config) => () => {
        validate(document.getElementById(config.targetElementId).value);
    }

    const CONFIGURATIONS = [
        {
            urlPattern: "http:\\/\\/localhost:",
            targetElementId: "text"
        },
        {
            urlPattern: "^https:\\/\\/.+\\.phoebius.com\\/issues\\/\\d+",
            targetElementId: "issue_description"
        }
    ];

    const CONFIGURATION_NAME = "listOfWork.config";

    const initConfiguration = () => {
        if (!GM_getValue(CONFIGURATION_NAME)) {
            GM_setValue(CONFIGURATION_NAME, JSON.stringify(CONFIGURATIONS));
        }
        let userConfig = GM_getValue(CONFIGURATION_NAME);
        let configurations = configHelper.getConfigObject(userConfig);
        let workingConfig = configurations.find((el) => new RegExp(el.urlPattern).test(window.location.href));
        if (workingConfig) {
            document.addEventListener('keydown', function(event) {
                //GM_log("Ctrl: " + event.ctrlKey +"; Shift: " + event.shiftKey + "; Key: " + event.key + "; Code: " + event.code);

                if ( event.altKey && event.shiftKey && event.code == 'KeyC') {
                    extractAndValidate(workingConfig)();
                    event.stopPropagation();
                    event.preventDefault();
                }
            }, true);

            GM_log("Shortcuts assigned");

            GM_registerMenuCommand("Check List of Works", extractAndValidate(workingConfig), 'c');
        } else {
            GM_log("LoW Checker: Configuration not found.");
        }
    }

    initConfiguration();

    GM_registerMenuCommand("Upload Custom Config", initConfiguration, 'p');
    configHelper.addConfigMenu('listOfWork', '[{"urlPattern" : "http:\\/\\/localhost:", "targetElementId" : "text"}]');
})();
