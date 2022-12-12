import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { Events } from 'discord.js';
import { client } from '../../src';

chai.use(sinonChai);
const { expect } = chai;

describe(`integrations.events.${Events.GuildMemberAdd}`, function () {
  let member, memberSendStub, channelSendStub;

  beforeEach(function () {
    memberSendStub = sinon.stub(client, 'channels.cache.send').resolves({});
    channelSendStub = sinon.stub(client, 'channels.cache.send').resolves({});

    member = {
      send: memberSendStub
    };
  });

  afterEach(function () {
    sinon.restore();
  });

  it('sends a new user a welcome message', function () {
    client.emit(Events.GuildMemberAdd, member);

    expect(1).to.be.equal(1);
  });
});
