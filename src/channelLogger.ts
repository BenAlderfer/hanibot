import { Client, PermissionFlagsBits } from 'discord.js';

/**
 * Posts log messages to a Discord channel. Only messages explicitly passed to
 * `send` go to the channel; regular console logging is unaffected.
 *
 * If no channel id is configured, `send` is a no-op so the bot still runs
 * without a log channel (e.g. locally).
 *
 * The client needs the Guilds intent: without it discord.js can't resolve
 * guild channels by id.
 */
export class ChannelLogger {
  constructor(
    private readonly client: Client,
    private readonly channelId: string | undefined
  ) {}

  /** Logs at startup whether channel logging is enabled and reachable. */
  async checkChannel(): Promise<void> {
    if (!this.channelId) {
      console.warn('LOG_CHANNEL_ID not set; channel logging is disabled');
      return;
    }

    try {
      const channel = await this.fetchChannel(this.channelId);
      // isSendable() only checks the channel type, so also check permissions.
      const canSend =
        !channel.isDMBased() &&
        channel
          .permissionsFor(this.client.user!)
          ?.has([
            PermissionFlagsBits.ViewChannel,
            channel.isThread()
              ? PermissionFlagsBits.SendMessagesInThreads
              : PermissionFlagsBits.SendMessages
          ]);
      if (!canSend) {
        console.error(
          `Log channel ${this.channelId} is not usable`,
          'bot lacks View Channel or Send Messages permission'
        );
        return;
      }
      console.info(`Channel logging enabled for channel ${this.channelId}`);
    } catch (error) {
      console.error(`Log channel ${this.channelId} is not usable`, error);
    }
  }

  async send(message: string): Promise<void> {
    if (!this.channelId) {
      return;
    }

    try {
      const channel = await this.fetchChannel(this.channelId);
      // Never ping anyone from log messages.
      await channel.send({ content: message, allowedMentions: { parse: [] } });
    } catch (error) {
      console.error(
        `Failed to send log message to channel ${this.channelId}`,
        error
      );
    }
  }

  private async fetchChannel(channelId: string) {
    const channel = await this.client.channels.fetch(channelId);
    if (!channel?.isSendable()) {
      throw new Error('Channel not found or not a text channel');
    }
    return channel;
  }
}
