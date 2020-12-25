const azFunc = require("./index");

const makeAsync = async () => {
  await azFunc({"bla": "blubb"}, null, [0,1]);
}

makeAsync();