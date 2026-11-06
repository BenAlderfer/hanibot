import * as chai from 'chai';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { Events, userMention } from 'discord.js';
import { channelLogger, client } from '../../src';
import { welcomeMessage } from '../../src/strings';
import memberJoinedRes from '../testData/memberJoinedRes';
import { testUserId, testUserUsername } from '../testData/defaults';

chai.use(sinonChai);
const { expect } = chai;

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
    client.emit(Events.GuildMemberAdd, member);

    // wait a bit for the event to get handled
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(messageToUser).to.be.equal(welcomeMessage);
  });

  it('logs to the log channel after the welcome message is sent', async function () {
    client.emit(Events.GuildMemberAdd, member);
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(channelLog).to.have.been.calledOnceWith(
      `Welcome message sent to ${userMention(testUserId)} (${testUserUsername})`
    );
  });

  it('does not log to the log channel if the welcome message fails', async function () {
    sinon.stub(console, 'error');
    member.send = () =>
      Promise.reject(new Error('Cannot send messages to this user'));

    client.emit(Events.GuildMemberAdd, member);
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(channelLog).to.have.callCount(0);
  });
});
