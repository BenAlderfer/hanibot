import * as chai from 'chai';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { client, startBot } from '../../src';

chai.use(sinonChai);
const { expect } = chai;

describe('startBot', function () {
  afterEach(function () {
    sinon.restore();
    process.exitCode = undefined;
  });

  it('throws if no token is provided', function () {
    expect(() => startBot(undefined)).to.throw(
      'Missing required TOKEN environment variable'
    );
  });

  it('logs and sets a failing exit code when login fails', async function () {
    const error = new Error('invalid token');
    sinon.stub(client, 'login').rejects(error);
    const consoleError = sinon.stub(console, 'error');

    await startBot('fake-token');

    expect(consoleError).to.have.been.calledWith(
      'Failed to log in to Discord',
      error
    );
    expect(process.exitCode).to.equal(1);
  });
});
