// console_format.js
/*
This module contains tools to help color and format your console texts.
*/

module.exports.ConsoleTextFormat = (seq) => {
	if (Array.isArray(seq)) {
		return `\x1b[${seq.join(';')}m`;
	} else {
		return `\x1b[${seq}m`;
	}
};

module.exports.ConsoleTextStyles = {
	/*
	This set enumerates different text styles interpreted by consoles.
	*/

	// Bright Foreground colors:
	FG_BRIGHT_WHITE: 97,
	FG_BRIGHT_CYAN: 96,
	FG_BRIGHT_MAGENTA: 95,
	FG_BRIGHT_BLUE: 94,
	FG_BRIGHT_YELLOW: 93,
	FG_BRIGHT_GREEN: 92,
	FG_BRIGHT_RED: 91,
	FG_BRIGHT_BLACK: 90,

	// Normal Foreground colors:
	FG_WHITE: 37,
	FG_CYAN: 36,
	FG_MAGENTA: 35,
	FG_BLUE: 34,
	FG_YELLOW: 33,
	FG_GREEN: 32,
	FG_RED: 31,
	FG_BLACK: 30,

	// Bright Background colors:
	BG_BRIGHT_WHITE: 107,
	BG_BRIGHT_CYAN: 106,
	BG_BRIGHT_MAGENTA: 105,
	BG_BRIGHT_BLUE: 104,
	BG_BRIGHT_YELLOW: 103,
	BG_BRIGHT_GREEN: 102,
	BG_BRIGHT_RED: 101,
	BG_BRIGHT_BLACK: 100,

	// Normal Background colors:
	BG_WHITE: 47,
	BG_CYAN: 46,
	BG_MAGENTA: 45,
	BG_BLUE: 44,
	BG_YELLOW: 43,
	BG_GREEN: 42,
	BG_RED: 41,
	BG_BLACK: 40,

	// Styles:
	NORMAL: 0, // reset to normal character style (no color, bold, or underlining)
	BOLD: 1,
	FAINT: 2,
	UNDERLINE: 4
};
