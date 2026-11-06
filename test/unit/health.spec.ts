import { expect } from 'chai';
import * as sinon from 'sinon';
import { existsSync, mkdtempSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Client } from 'discord.js';
import { startHeartbeat } from '../../src/health';

describe('startHeartbeat', function () {
  let dir: string, file: string, timer: NodeJS.Timeout;

  beforeEach(function () {
    dir = mkdtempSync(join(tmpdir(), 'hanibot-health-'));
    file = join(dir, 'healthy');
  });

  afterEach(function () {
    clearInterval(timer);
    rmSync(dir, { recursive: true, force: true });
    sinon.restore();
  });

  it('writes the health file when the client is ready', function () {
    const client = { isReady: () => true } as unknown as Client;
    timer = startHeartbeat(client, file);
    expect(existsSync(file)).to.equal(true);
  });

  it('does not write the health file when the client is not ready', function () {
    const client = { isReady: () => false } as unknown as Client;
    timer = startHeartbeat(client, file);
    expect(existsSync(file)).to.equal(false);
  });

  it('refreshes the health file on every interval', function () {
    const clock = sinon.useFakeTimers({ toFake: ['setInterval', 'Date'] });
    const client = { isReady: () => true } as unknown as Client;
    timer = startHeartbeat(client, file);
    const first = statSync(file).mtimeMs;

    rmSync(file);
    clock.tick(30_000);

    expect(existsSync(file)).to.equal(true);
    expect(statSync(file).mtimeMs).to.be.at.least(first);
  });
});
