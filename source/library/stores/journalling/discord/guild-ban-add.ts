import { findAuditEntry } from "rost/stores/journalling/loggers";
import type { EventLogger } from "rost/stores/journalling/loggers";

const logger: EventLogger<"guildBanAdd"> = (client, [user, guildId], { guildLocale }) => {
	const strings = constants.contexts.guildBanAdd({ localise: client.localise, locale: guildLocale });

	const auditEntry = findAuditEntry(client, guildId, Discord.AuditLogEvents.MemberBanAdd, (entry) => entry.targetId === user.id);

	const description =
		auditEntry?.userId !== undefined
			? strings.descriptionBy({ user: client.diagnostics.user(user), moderator: client.diagnostics.user(auditEntry.userId) })
			: strings.description({ user: client.diagnostics.user(user) });

	return {
		flags: Discord.MessageFlags.IsComponentV2,
		components: [
			{
				type: Discord.MessageComponentTypes.Container,
				accentColor: constants.colours.failure,
				components: [
					{
						type: Discord.MessageComponentTypes.TextDisplay,
						content: `# ${constants.emojis.events.user.banned} ${strings.title}\n${description}`,
					},
				],
			},
		],
	};
};

export default logger;
