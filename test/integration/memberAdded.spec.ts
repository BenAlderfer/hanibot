import * as _ from 'lodash';
import * as chai from 'chai';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { Events } from 'discord.js';
import { client } from '../../src';
import { welcomeMessage } from '../../src/strings';
import memberJoinedRes from '../testData/memberJoinedRes';
import loginRes from '../testData/loginRes';

chai.use(sinonChai);
const { expect } = chai;

describe(`integrations.events.${Events.GuildMemberAdd}`, function () {
  let member: any, messageToUser: string;

  beforeEach(function () {
    member = memberJoinedRes;
    // @ts-ignore
    member.send = (message: string) => {
      messageToUser = message.toString();
    };

    _.set(client, 'login', loginRes);
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
});
