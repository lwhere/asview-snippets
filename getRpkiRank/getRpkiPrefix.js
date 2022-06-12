const fs = require('fs')

const data = JSON.parse(fs.readFileSync('./rpki.json'));

let v6Num = 0;
let v4Num = 0;
let prefixObjV4 = {}
let prefixObjV6 = {}


function getPrefixNum(str) {
  let index = str.indexOf('/');
  return str.slice(index + 1, str.length)
}

function setPrefixValue(prefix) {
  if (prefix.indexOf(':') !== -1) {
    v6Num++;
    let key = getPrefixNum(prefix);
    if (!prefixObjV6[key]) {
      prefixObjV6[key] = 0;
    }
    prefixObjV6[key]++;
  }
  else {
    v4Num++;
    let key = getPrefixNum(prefix);
    if (!prefixObjV4[key]) {
      prefixObjV4[key] = 0;
    }
    prefixObjV4[key]++;
  }
}


for (let item of data.roas) {
  let prefix = item.prefix
  setPrefixValue(prefix)
}

function v4OutPut() {
  let arrV4 = Object.entries(prefixObjV4)
  // console.log(v6Num, v4Num)
  // console.log(prefixObjV4)
  let v4Keys = [];
  let v4Values = [];
  let v4SubValues = [];
  for (let i of arrV4) {
    v4Keys.push(i[0])
    v4Values.push(i[1])
    v4SubValues.push(v4Num - i[1])
  }
  console.log(v4Num)
  console.log(v4Keys)
  console.log(v4Values)
  console.log(v4SubValues)
}
v4OutPut()


function v6OutPut() {
  let arrv6 = Object.entries(prefixObjV6)
  let v6Keys = [];
  let v6Values = [];
  let v6SubValues = [];
  for (let i of arrv6) {
    v6Keys.push(i[0])
    v6Values.push(i[1])
    v6SubValues.push(v6Num - i[1])
  }
  console.log(v6Num)
  console.log(v6Keys)
  console.log(v6Values)
  console.log(v6SubValues)
}
v6OutPut()



