// ==UserScript==
// @name         LoW-Checker
// @version      0.1
// @description  List of Work (LoW) Checker
// @author       calina@scand.com
// @author       bosak@scand.com
// @match        http://localhost:8080/*
// @grant        GM_log
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';

    const CONFIGURATION = [
        {
            prefixUrl: "http://localhost:8080/",
            targetElementId: "text"
        },
    ];

    const VALIDATORS = {
        intoductionValidator: function (line) {
            let introductions = ["- Development of functionality", "- Разработка функциональности"];
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

    let currentConfig;

    const seachForPrefix = () => {
        currentConfig = CONFIGURATION.find((el) => el.prefixUrl === window.location.href);
    };

    document.addEventListener('keydown', function(event) {
        //GM_log("Ctrl: " + event.ctrlKey +"; Shift: " + event.shiftKey + "; Key: " + event.key + "; Code: " + event.code);

        if ( event.altKey && event.shiftKey && event.code == 'KeyC') {
            window.validator.extractAndValidate();
            event.stopPropagation();
            event.preventDefault();
        }
    }, true);
    GM_log("Shortcuts aassigned");

    window.validator = {
        extractAndValidate: function () {
            validate(document.getElementById(currentConfig.targetElementId).value);
        }
    }

    GM_registerMenuCommand("Check List of Works", window.validator.extractAndValidate, 'c');
    seachForPrefix();
})();