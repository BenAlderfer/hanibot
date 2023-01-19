import * as _ from 'lodash';
import * as chai from 'chai';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { Events } from 'discord.js';
import { client } from '../../src';
import { welcomeMessage } from '../../src/strings';
import { testUserUsername } from '../testData/defaults';
import memberJoinedRes from '../testData/memberJoinedRes';
import loginRes from '../testData/loginRes';

chai.use(sinonChai);
const { expect } = chai;

describe(`integrations.events.${Events.GuildMemberAdd}`, function () {
  let member: any, messageToUser: string, messageToAdmin: string;

  beforeEach(function () {
    member = memberJoinedRes;
    // @ts-ignore
    member.send = (message: string) => {
      messageToUser = message.toString();
    };

    const channelSend = (message: string) => {
      messageToAdmin = message;
    };

    _.set(client, 'login', loginRes);

    _.set(client, 'channels.cache.get', () => {
      return { send: channelSend };
    });
  });

  afterEach(function () {
    sinon.restore();
    messageToUser = '';
    messageToAdmin = '';
  });

  it('sends a new user a welcome message', async function () {
    client.emit(Events.GuildMemberAdd, member);

    // wait a bit for the event to get handled
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(messageToUser).to.be.equal(welcomeMessage);
  });

  it('sends admin channel a message when a new member joins', async function () {
    client.emit(Events.GuildMemberAdd, member);

    // wait a bit for the event to get handled
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(messageToAdmin).to.be.equal(
      `${testUserUsername} has joined the server. Please add the guy/girl role to their account.`
    );
  });
});
