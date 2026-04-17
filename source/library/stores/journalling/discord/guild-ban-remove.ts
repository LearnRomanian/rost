import { findAuditEntry } from "rost/stores/journalling/loggers";
import type { EventLogger } from "rost/stores/journalling/loggers";

const logger: EventLogger<"guildBanRemove"> = (client, [user, guildId], { guildLocale }) => {
	const strings = constants.contexts.guildBanRemove({ localise: client.localise, locale: guildLocale });

	const auditEntry = findAuditEntry(client, guildId, Discord.AuditLogEvents.MemberBanRemove, (entry) => entry.targetId === user.id);

	const description =
		auditEntry?.userId !== undefined
			? strings.descriptionBy({ user: client.diagnostics.user(user), moderator: client.diagnostics.user(auditEntry.userId) })
			: strings.description({ user: client.diagnostics.user(user) });

	return {
		flags: Discord.MessageFlags.IsComponentV2,
		components: [
			{
				type: Discord.MessageComponentTypes.Container,
				accentColor: constants.colours.success,
				components: [
					{
						type: Discord.MessageComponentTypes.TextDisplay,
						content: `# ${constants.emojis.events.user.unbanned} ${strings.title}\n${description}`,
					},
				],
			},
		],
	};
};

export default logger;
