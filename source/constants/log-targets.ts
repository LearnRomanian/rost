import directories from "rost:constants/directories";

const rotation = Object.freeze({
	frequency: "daily",
	limit: { count: 7 },
	mkdir: true,
});

export default Object.freeze({
	stdout: {
		feedback: {
			target: "pino-pretty",
			level: "debug",
			options: {
				ignore: "pid,hostname",
			},
		},
	},
	file: {
		debug: {
			target: "pino-roll",
			level: "debug",
			options: { file: `${directories.logs}/debug-log.os`, ...rotation },
		},
		standard: {
			target: "pino-roll",
			level: "info",
			options: { file: `${directories.logs}/log.os`, ...rotation },
		},
		discordeno: {
			target: "pino-roll",
			level: "debug",
			options: {
				file: `${directories.logs}/discordeno-log.os`,
				...rotation,
			},
		},
	},
} as const);
