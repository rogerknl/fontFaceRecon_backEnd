const proxyquire =  require('proxyquire');
const assert =  require('chai').assert;
var expect = require('chai').expect;
const puppetOriginal = require('../services/puppet');
const cacheOriginal = require('../services/cache');
const puppeteer = require('puppeteer');
const sinon = require('sinon');

const cacheStub  =  {
  getCache: sinon.stub(),
  setCache: sinon.stub()
};

const puppet = proxyquire('../services/puppet',{'./cache.js' : cacheStub});



describe('Puppet', function() {
  it('If given URL hasnt https:// or http:// it has to add https:// ', async () => {
    cacheStub.getCache.returns(true);
    await puppet.puppetRequest('www.google.com/');
    expect(cacheStub.getCache.calledWith('https://www.google.com/')).to.be.true;
  })
  it('If given URL has https:// we dont modify it', async () => {
    cacheStub.getCache.returns(true);
    await puppet.puppetRequest('https://www.google.com/');
    expect(cacheStub.getCache.calledWith('https://www.google.com/')).to.be.true;
  })
  it('If given URL hasnt http:// we dont modify it ', async () => {
    cacheStub.getCache.returns(true);
    await puppet.puppetRequest('http://www.google.com/');
    expect(cacheStub.getCache.calledWith('http://www.google.com/')).to.be.true; //comprobar que https http
  })

  it('If url has not resolution it throws an error ', async () => {
    cacheStub.getCache = cacheOriginal.getCache;
    let pass;
    try {
      await puppet.puppetRequest('asdasd');
      pass = false
    } catch (e) {
      pass = true;
    }
    expect(pass).to.be.true;
  }).timeout(5000)

  it('First time have to write result on cache ', async () => {
    //clean cache
    cacheOriginal.destroyAll();

    //asign original cache methods to stub ones
    cacheStub.getCache = cacheOriginal.getCache;
    cacheStub.setCache = cacheOriginal.setCache;

    //create spyes to cache methods
    let spyGet = sinon.spy(cacheStub, "getCache");
    let spySet = sinon.spy(cacheStub, "setCache");

    //call method to test
    await puppet.puppetRequest('www.google.com');

    //expect both cache spyes was called 1 time
    expect(spyGet.callCount).to.equal(1);
    expect(spySet.callCount).to.equal(1);

    //teardown spyes
    cacheStub.getCache.restore();
    cacheStub.setCache.restore();
  }).timeout(5000)

  it('Second time have to return directly without do something more ', async () => {
    //asign original cache methods to stub ones
    cacheStub.getCache = cacheOriginal.getCache;

    //create spyes to getCache and puppeteer.launch (first function after return)
    let spyGet = sinon.spy(cacheStub, "getCache");
    let spyLaunch = sinon.spy(puppeteer,'launch');

    //call method to test
    await puppet.puppetRequest('www.google.com');

    //expect getcache was called 1 time and 0 launch
    expect(spyGet.callCount).to.equal(1);
    expect(spyLaunch.callCount).to.equal(0);

    //teardown spyes
    cacheStub.getCache.restore();
    puppeteer.launch.restore();
  })
});