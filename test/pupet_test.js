const proxyquire =  require('proxyquire');
const assert =  require('chai').assert;
var expect = require('chai').expect;
const puppetOriginal = require('../services/puppet');
const cacheOriginal = require('../services/cache');
const sinon = require('sinon');

const cacheStub  =  {
  getCache: sinon.stub(),
  setCache: sinon.stub()
};

const puppet = proxyquire('../services/puppet',{'./cache.js' : cacheStub});

puppet.getStyles = sinon.stub()

describe('Puppeter', function() {
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




  // describe('puppetRequest', function(done) {
    // describe('Handling url http/https',function() {


  //     it('If given URL has http it shldnt touch it', (done)=>{
  //       cacheStub.getCache = (url) => {
  //         return new Promise ( (resolve) =>{
  //           resolve(
  //             expect(url).to.be.equal("http://www.google.com/"));
  //         }).then(() => done(), error => done(error));
  //       };
  //       puppet.getStyles = function (){
  //       }
  //       cacheStub.setCache = function () {
  //       };
  //        puppet.puppetRequest("http://www.google.com/");
  //     });

  //     it('If given URL has not http||https it have to add https:// before it',  (done)=>{
  //       cacheStub.getCache = (url) => {
  //         return new Promise ( (resolve) =>{
  //           resolve(
  //             expect(url).to.be.equal("https://www.google.com/"));
  //         }).then(() => done(), error => done(error));
  //       };

  //       cacheStub.setCache = function () {
  //       };
  //        puppet.puppetRequest("www.google.com/");

  //     });
  //   });


  //   describe ('If given URL incorrect or remote server is down:', function() {
  //     it('If server is down on URL is not correct should throw an error', function() {

  //     });
  //   });
  //   describe ('If given URL correct:', function() {
  //     it('If info is in the cache should be returned directly', async () => {
  //       cacheStub.getCache = (url) => {
  //         return new Promise ( (resolve) =>{resolve({data:'Mock cached data'})});
  //       };

  //       const res = await puppet.puppetRequest("www.google.com/")
  //       expect(res).to.be.equal('Mock cached data');

  //     });
  //     this.timeout(10000);
  //     describe('If info is not in the cache:', function() {
  //       it('Connect to remote site and scrap the data, then return it and save it into cache', function() {
  //         // cacheStub.getCache = (url) => {
  //         // };
  //         // await puppet.puppetRequest("www.google.com/");
  //       });
  //       it('Server is up but not responding, should throw an error ', async () =>{
  //         await new Promise (resolve =>{setTimeout(resolve,4000)});
  //         cacheStub.getCache = cacheOriginal.getCache;
  //         cacheStub.setCache = cacheOriginal.setCache;
  //         const res = await puppet.puppetRequest("www.google.com");
  //         //console.log(res)

  //       });
  //     });
  //   });
  // });
});