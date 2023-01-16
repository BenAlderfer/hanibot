import * as _ from 'lodash';
import * as chai from 'chai';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { Events, GuildMember } from 'discord.js';
import { client } from '../../src';
import { welcomeMessage } from '../../src/strings';
import { testUserUsername } from '../testData/defaults';

chai.use(sinonChai);
const { expect } = chai;

describe(`integrations.events.${Events.GuildMemberAdd}`, function () {
  let member: GuildMember, messageToUser: string, messageToAdmin: string;

  beforeEach(function () {
    // @ts-ignore
    member = new GuildMember();
    // @ts-ignore
    member.user = {
      username: testUserUsername
    };
    // @ts-ignore
    member.send = (message: string) => {
      messageToUser = message.toString();
    };

    const channelSend = (message: string) => {
      messageToAdmin = message;
    };

    _.set(client, 'channels.cache.get', (channelId: string) => {
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
