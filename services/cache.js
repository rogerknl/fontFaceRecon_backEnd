var redis = require('redis');
var client = redis.createClient();


const getCache = async (hash) =>
{
  return new Promise (function (resolve, reject) {
    client.hgetall(hash, function (err,replies) {
      if (replies == null) resolve(undefined);
      else {
        resolve(replies);
      }
    });
  });
};
const setCache = async (hash,value) => {
  client.hset(hash,'data',value);
  client.expire(hash, 3600);
};

const destroySession = async (key) => {

};

module.exports = {
  getCache,
  setCache
};