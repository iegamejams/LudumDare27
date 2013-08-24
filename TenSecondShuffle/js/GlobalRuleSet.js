"use strict";

Object.defineProperties(this, {
    GlobalRuleSet: {
        value: (function singleton_GlobalRuleSet() {
            var _globalRuleSet = {};
            Object.defineProperties(_globalRuleSet, {
                GAME_SWITCH_FRAMES: {
                    value: 60 * 10 // 60 frames times 10 seconds
                },
                GameHostHeight: {
                    value: 768
                },
                GameHostWidth: {
                    value: 1024
                },

                GameWidth: {
                    value: 700
                },
                GameHeight: {
                    value: 700
                },
            });
            Object.defineProperties(_globalRuleSet, {
                GameMinX: {
                    value: (_globalRuleSet.GameHostWidth - _globalRuleSet.GameWidth) / 2
                },
                GameMinY: {
                    value: (_globalRuleSet.GameHostHeight - _globalRuleSet.GameHeight) / 2
                }
            });
            return Object.freeze(_globalRuleSet);
        })()
    }
});