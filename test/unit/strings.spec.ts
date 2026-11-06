import { expect } from 'chai';
import { welcomeMessage } from '../../src/strings';

describe('welcomeMessage', function () {
  it('fits within the Discord 2000 character message limit', function () {
    expect(welcomeMessage.length).to.be.at.most(2000);
  });
});
