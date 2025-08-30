
/**
 * Returns if the given keyboard key is pressed.
 * The key name can be one of (case-insensitive):
 * - `"esc"`, `"escape"`
 * - `"0"`, `"1"`, `"2"`, `"3"`, `"4"`, `"5"`, `"6"`, `"7"`, `"8"`, `"9"`,
 * - `"-"`, `"minus"`
 * - `"="`, `"equal"`
 * - `"backspace"`
 * - `"tab"`
 * - `"a"`, `"b"`, `"c"`, `"d"`, ..., `"w"`, `"x"`, `"y"`, `"z"`
 * - `"["`, `"bracketleft"`, `"leftbracket"`, `"bracketopen"`
 * - `"]"`, `"bracketright"`, `"rightbracket"`, `"bracketclose"`
 * - `"enter"`
 * - `"ctrl"`, `"ctrlleft"`, `"leftctrl"`
 * - `";"`, `"semicolon"`
 * - `'"'`, `"quote"`
 * - `"backquote"`
 * - `"shift"`, `"shiftleft"`, `"leftshift"`
 * - `"\\"`, `"backslash"`
 * - `","`, `"comma"`
 * - `"."`, `"dot"`, `"period"`
 * - `"/"`, `"slash"`
 * - `"shiftright"`, `"rightshift"`
 * - `"alt"`, `"altleft"`, `"leftalt"`
 * - `" "`, `"space"`
 * - `"caps"`, `"capslock"`
 * - `"f1"`, `"f2"`, `"f3"`, ..., `"f10"`, `"f11"`, `"f12"`
 * - `"up"`, `"uparrow"`, `"arrowup"`
 * - `"down"`, `"downarrow"`, `"arrowdown"`
 * - `"left"`, `"leftarrow"`, `"arrowleft"`
 * - `"right"`, `"rightarrow"`, `"arrowright"`
 * @param {string} key Name of the key to check.
 * @returns True if the key is pressed at the time of calling, and otherwise false.
 */
const isPressed = (() => {

    const SHUEN_KEY_MAP = Object.freeze({
        "esc": "Escape", "escape": "Escape",
        "0": "Digit0",
        "1": "Digit1",
        "2": "Digit2",
        "3": "Digit3",
        "4": "Digit4",
        "5": "Digit5",
        "6": "Digit6",
        "7": "Digit7",
        "8": "Digit8",
        "9": "Digit9",
        "-": "Minus", "minus": "Minus",
        "=": "Equal", "equal": "Equal",
        "backspace": "Backspace",
        "tab": "Tab",
        "a": "KeyA",
        "b": "KeyB",
        "c": "KeyC",
        "d": "KeyD",
        "e": "KeyE",
        "f": "KeyF",
        "g": "KeyG",
        "h": "KeyH",
        "i": "KeyI",
        "j": "KeyJ",
        "k": "KeyK",
        "l": "KeyL",
        "m": "KeyM",
        "n": "KeyN",
        "o": "KeyO",
        "p": "KeyP",
        "q": "KeyQ",
        "r": "KeyR",
        "s": "KeyS",
        "t": "KeyT",
        "u": "KeyU",
        "v": "KeyV",
        "w": "KeyW",
        "x": "KeyX",
        "y": "KeyY",
        "z": "KeyZ",
        "[": "BracketLeft", "bracketleft": "BracketLeft", "leftbracket": "BracketLeft", "bracketopen": "BracketLeft",
        "]": "BracketRight", "bracketright": "BracketRight", "rightbracket": "BracketRight", "bracketclose": "BracketRight",
        "enter": "Enter",
        "ctrl": "ControlLeft", "ctrlleft": "ControlLeft", "leftctrl": "ControlLeft",
        ";": "Semicolon", "semicolon": "Semicolon",
        "\"": "Quote", "quote": "Quote",
        "`": "Backquote", "backquote": "Backquote",
        "shift": "ShiftLeft", "shiftleft": "ShiftLeft", "leftshift": "ShiftLeft",
        "\\": "Backslash", "backslash": "Backslash",
        ",": "Comma", "comma": "Comma",
        ".": "Period", "dot": "Period", "period": "Period",
        "/": "Slash", "slash": "Slash",
        "shiftright": "ShiftRight", "rightshift": "ShiftRight",
        "alt": "AltLeft", "altleft": "AltLeft", "leftalt": "AltLeft",
        " ": "Space", "space": "Space",
        "caps": "CapsLock", "capslock": "CapsLock",
        "f1": "F1",
        "f2": "F2",
        "f3": "F3",
        "f4": "F4",
        "f5": "F5",
        "f6": "F6",
        "f7": "F7",
        "f8": "F8",
        "f9": "F9",
        "f10": "F10",
        "f11": "F11",
        "f12": "F12",
        "up": "ArrowUp", "arrowup": "ArrowUp", "uparrow": "ArrowUp",
        "down": "ArrowDown", "arrowdown": "ArrowDown", "downarrow": "ArrowDown",
        "left": "ArrowLeft", "arrowleft": "ArrowLeft", "leftarrow": "ArrowLeft",
        "right": "ArrowRight", "arrowright": "ArrowRight", "rightarrow": "ArrowRight"
    });

    const pressed = new Set();
    window.addEventListener("keydown", e => pressed.add(e.code));
    window.addEventListener("keyup", e => pressed.delete(e.code));

    return (key) => {
        const keyCode = SHUEN_KEY_MAP[key.toLowerCase()];
        if(keyCode === undefined) {
            throw new Error(`'${key}' is not a known key!`);
        }
        return pressed.has(keyCode);
    };

})();


/**
 * Returns if the given mouse button is clicked.
 * The button name can be one of (case-insensitive):
 * - `"left"`
 * - `"middle"`, `"wheel"`
 * - `"right"`
 * @param {string} button Name of the button to check.
 * @returns True if the button is clicked at the time of calling, and otherwise false.
 */
const isClicked = (() => {
    
    const SHUEN_BUTTON_MAP = Object.freeze({
        "left": 0,
        "wheel": 1, "middle": 1,
        "right": 2
    });

    const clicked = new Set();
    window.addEventListener("mousedown", e => clicked.add(e.button));
    window.addEventListener("mouseup", e => clicked.delete(e.button));

    return (button) => {
        const buttonCode = SHUEN_BUTTON_MAP[button.toLowerCase()];
        if(buttonCode === undefined) {
            throw new Error(`'${button}' is not a known button!`);
        }
        return clicked.has(buttonCode);
    };

})();