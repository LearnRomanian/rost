import { mention } from "rost:constants/formatting";
import { isDefined } from "rost:core/utilities";
import { JournallingStore } from "rost/stores/journalling";
import { findAuditEntry } from "rost/stores/journalling/loggers";
import type { EventLogger } from "rost/stores/journalling/loggers";

const logger: EventLogger<"messageDeleteBulk"> = (client, [payload], { guildLocale }) => {
	const messages = payload.ids
		.toReversed()
		.map((messageId) => client.entities.messages.latest.get(messageId))
		.filter(isDefined);
	const messageLog = JournallingStore.generateMessageLog(client, { messages });

	const strings = constants.contexts.messageDeleteBulk({ localise: client.localise, locale: guildLocale });

	const auditEntry = findAuditEntry(
		client,
		payload.guildId,
		Discord.AuditLogEvents.MessageBulkDelete,
		(entry) => entry.targetId === payload.channelId,
	);

	const messagesPlural = client.pluralise("events.messageDeleteBulk.description.messages", guildLocale, {
		quantity: messages.length,
	});
	const channel = mention(payload.channelId, { type: "channel" });

	const description =
		auditEntry?.userId !== undefined
			? strings.descriptionBy({ messages: messagesPlural, channel, moderator: client.diagnostics.user(auditEntry.userId) })
			: strings.description({ messages: messagesPlural, channel });

	return {
		flags: Discord.MessageFlags.IsComponentV2,
		components: [
			{
				type: Discord.MessageComponentTypes.Container,
				accentColor: constants.colours.failure,
				components: [
					{
						type: Discord.MessageComponentTypes.TextDisplay,
						content: `# ${constants.emojis.events.message.deleted} ${strings.title}\n${description}`,
					},
				],
			},
		],
		files: [{ name: "log.txt", blob: new Blob([messageLog]) } as Discord.FileContent],
	};
};

export default logger;
