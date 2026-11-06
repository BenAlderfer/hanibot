import * as chai from 'chai';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {
  DiscordAPIError,
  Events,
  RESTJSONErrorCodes,
  userMention
} from 'discord.js';
import { channelLogger, client } from '../../src';
import { welcomeMessage } from '../../src/strings';
import memberJoinedRes from '../testData/memberJoinedRes';
import { testUserId, testUserUsername } from '../testData/defaults';

chai.use(sinonChai);
const { expect } = chai;

// Emits the event, then waits a bit for the async handler to finish.
async function emitAndWait(member: any) {
  client.emit(Events.GuildMemberAdd, member);
  await new Promise((resolve) => setTimeout(resolve, 100));
}

describe(`integrations.events.${Events.GuildMemberAdd}`, function () {
  let member: any, messageToUser: string, channelLog: sinon.SinonStub;

  beforeEach(function () {
    channelLog = sinon.stub(channelLogger, 'send').resolves();
    member = { ...memberJoinedRes };
    // @ts-ignore
    member.send = (message: string) => {
      messageToUser = message.toString();
    };
  });

  afterEach(function () {
    sinon.restore();
    messageToUser = '';
  });

  it('sends a new user a welcome message', async function () {
    await emitAndWait(member);

    expect(messageToUser).to.be.equal(welcomeMessage);
  });

  it('logs to the log channel after the welcome message is sent', async function () {
    await emitAndWait(member);

    expect(channelLog).to.have.been.calledOnceWith(
      `Welcome message sent to ${userMention(testUserId)} (${testUserUsername})`
    );
  });

  it('truncates long failure reasons in the log channel message', async function () {
    sinon.stub(console, 'error');
    member.send = () => Promise.reject(new Error('x'.repeat(5000)));

    await emitAndWait(member);

    expect(channelLog.firstCall.args[0].length).to.be.below(2000);
  });

  it('logs the failure to the log channel if the welcome message fails', async function () {
    sinon.stub(console, 'error');
    member.send = () =>
      Promise.reject(new Error('Cannot send messages to this user'));

    await emitAndWait(member);

    expect(channelLog).to.have.been.calledOnceWith(
      `Failed to send welcome message to ${userMention(testUserId)} (${testUserUsername}): Cannot send messages to this user`
    );
  });

  it('warns instead of erroring when the user has DMs disabled', async function () {
    const consoleError = sinon.stub(console, 'error');
    const consoleWarn = sinon.stub(console, 'warn');
    member.send = () =>
      Promise.reject(
        new DiscordAPIError(
          {
            code: RESTJSONErrorCodes.CannotSendMessagesToThisUser,
            message: 'Cannot send messages to this user'
          },
          RESTJSONErrorCodes.CannotSendMessagesToThisUser,
          403,
          'POST',
          '',
          {}
        )
      );

    await emitAndWait(member);

    expect(consoleWarn.callCount).to.equal(1);
    expect(consoleError.callCount).to.equal(0);
    expect(channelLog.callCount).to.equal(1);
  });
});
