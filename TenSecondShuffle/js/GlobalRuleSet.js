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
                    value: 600
                },
                GameHeight: {
                    value: 600
                },

                TitleY: {
                    value: 15
                },
                TitleFont: {
                    value: "bold 18pt Calibri"
                },
                HelpTitleY: {
                    value: 45
                },
                HelpTitleFont: {
                    value: "italic bold 14pt Calibri"
                },
                RandomizeGameOrder: {
                    value: true
                },
                Debug: {
                    value: true
                }
            });
            Object.defineProperties(_globalRuleSet, {
                GameMinX: {
                    value: (_globalRuleSet.GameHostWidth - _globalRuleSet.GameWidth) / 2
                },
                GameMinY: {
                    value: (_globalRuleSet.GameHostHeight - _globalRuleSet.GameHeight) / 2
                }
            });
            Object.defineProperties(_globalRuleSet, {
                GameCenterX: {
                    value: _globalRuleSet.GameWidth / 2 + _globalRuleSet.GameMinX
                },
                GameCenterY: {
                    value: _globalRuleSet.GameHeight / 2 + _globalRuleSet.GameMinY
                }
            });
            return Object.freeze(_globalRuleSet);
        })()
    }
});