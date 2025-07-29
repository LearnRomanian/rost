import commands from "rost:constants/emojis/commands";
import events from "rost:constants/emojis/events";
import notices from "rost:constants/emojis/notices";
import roles from "rost:constants/emojis/roles";

export default Object.freeze({
	commands,
	events,
	roles,
	notices,
	verification: {
		for: "🟩",
		against: "🟥",
	},
	link: "🔗",
	source: "©️",
	interactions: {
		menu: {
			controls: {
				back: "←",
				forward: "→",
			},
		},
	},
	showInChat: "🗨️",
} as const);
