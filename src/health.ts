import { writeFileSync } from 'node:fs';
import { Client } from 'discord.js';

const HEALTH_FILE = '/tmp/hanibot-healthy';
const HEARTBEAT_INTERVAL_MS = 30_000;

/**
 * Touches a file every 30s while the client is connected to the Discord
 * gateway. The Docker HEALTHCHECK fails when the file goes stale, so a
 * silently dead connection shows up as an unhealthy container.
 */
export function startHeartbeat(
  client: Client,
  file: string = HEALTH_FILE
): NodeJS.Timeout {
  const beat = () => {
    if (!client.isReady()) {
      return;
    }
    try {
      writeFileSync(file, String(Date.now()));
    } catch (error) {
      console.error(`Failed to write health file ${file}`, error);
    }
  };
  beat();
  // unref so the heartbeat never keeps the process alive on its own.
  return setInterval(beat, HEARTBEAT_INTERVAL_MS).unref();
}
