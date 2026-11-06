import * as chai from 'chai';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { Client } from 'discord.js';
import { ChannelLogger } from '../../src/channelLogger';
import fetchChannelRes from '../testData/fetchChannelRes';

chai.use(sinonChai);
const { expect } = chai;

const channelId = fetchChannelRes.id;

function fakeChannel(send: sinon.SinonStub, canSend = true) {
  return {
    isSendable: () => true,
    isDMBased: () => false,
    isThread: () => false,
    permissionsFor: () => ({ has: () => canSend }),
    send
  } as any;
}

describe('ChannelLogger', function () {
  let client: Client;
  let channelSend: sinon.SinonStub;
  let fetch: sinon.SinonStub;
  let consoleError: sinon.SinonStub;

  beforeEach(function () {
    client = new Client({ intents: [] });
    channelSend = sinon.stub().resolves();
    fetch = sinon
      .stub(client.channels, 'fetch')
      .resolves(fakeChannel(channelSend));
    consoleError = sinon.stub(console, 'error');
  });

  afterEach(function () {
    sinon.restore();
  });

  describe('send', function () {
    it('sends the message to the configured channel without pinging anyone', async function () {
      await new ChannelLogger(client, channelId).send('hello');

      expect(fetch).to.have.been.calledWith(channelId);
      expect(channelSend).to.have.been.calledWith({
        content: 'hello',
        allowedMentions: { parse: [] }
      });
    });

    it('does nothing when no channel is configured', async function () {
      await new ChannelLogger(client, undefined).send('hello');

      expect(fetch).to.have.callCount(0);
    });

    it('logs instead of throwing when the channel is missing', async function () {
      fetch.resolves(null);

      await new ChannelLogger(client, channelId).send('hello');

      expect(consoleError).to.have.been.calledWith(
        `Failed to send log message to channel ${channelId}`
      );
    });

    it('logs instead of throwing when fetching the channel fails', async function () {
      const error = new Error('Unknown Channel');
      fetch.rejects(error);

      await new ChannelLogger(client, channelId).send('hello');

      expect(consoleError).to.have.been.calledWith(
        `Failed to send log message to channel ${channelId}`,
        error
      );
    });

    it('logs instead of throwing when sending fails', async function () {
      const error = new Error('Missing Access');
      channelSend.rejects(error);

      await new ChannelLogger(client, channelId).send('hello');

      expect(consoleError).to.have.been.calledWith(
        `Failed to send log message to channel ${channelId}`,
        error
      );
    });
  });

  describe('checkChannel', function () {
    it('warns when no channel is configured', async function () {
      const consoleWarn = sinon.stub(console, 'warn');

      await new ChannelLogger(client, undefined).checkChannel();

      expect(consoleWarn).to.have.been.calledWith(
        'LOG_CHANNEL_ID not set; channel logging is disabled'
      );
    });

    it('reports success when the bot can send to the channel', async function () {
      const consoleInfo = sinon.stub(console, 'info');

      await new ChannelLogger(client, channelId).checkChannel();

      expect(consoleInfo).to.have.been.calledWith(
        `Channel logging enabled for channel ${channelId}`
      );
    });

    it('logs an error when the bot lacks send permission', async function () {
      fetch.resolves(fakeChannel(channelSend, false));

      await new ChannelLogger(client, channelId).checkChannel();

      expect(consoleError).to.have.been.calledWith(
        `Log channel ${channelId} is not usable`
      );
    });

    it('logs an error when fetching the channel fails', async function () {
      const error = new Error('Unknown Channel');
      fetch.rejects(error);

      await new ChannelLogger(client, channelId).checkChannel();

      expect(consoleError).to.have.been.calledWith(
        `Log channel ${channelId} is not usable`,
        error
      );
    });

    it('logs an error when the channel is a DM', async function () {
      fetch.resolves({ ...fakeChannel(channelSend), isDMBased: () => true });

      await new ChannelLogger(client, channelId).checkChannel();

      expect(consoleError).to.have.been.calledWith(
        `Log channel ${channelId} is not usable`
      );
    });

    it('logs an error when the channel is not usable', async function () {
      fetch.resolves(null);

      await new ChannelLogger(client, channelId).checkChannel();

      expect(consoleError).to.have.been.calledWith(
        `Log channel ${channelId} is not usable`
      );
    });
  });
});
