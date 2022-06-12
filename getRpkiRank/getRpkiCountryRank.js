const fs = require('fs');

function getRpkiRank(url) {
  const invalidData = JSON.parse(fs.readFileSync(url))
  const invalidArr = []
  for (let item of invalidData) {
    let index = invalidArr.findIndex(elem => elem.name === item.country)
    if (index === -1) {
      invalidArr.push({
        name: item.country,
        value: item.count
      })
    }
    else {
      invalidArr[index].value += item.count;
    }
  }
  // let invalidTop20 = invalidArr.sort((a, b) => b-a).slice(invalidArr.length - 20, invalidArr.length-1)
  let invalidTop20 = invalidArr.sort((a, b) => b.value - a.value).slice(0, 10)
  let countries = [];
  let nums = [];
  invalidTop20.forEach(elem => {
    countries.push(elem.name);
    nums.push(elem.value)
  })
  let obj = {
    countries,
    nums
  }
  return obj;
  // console.log(invalidArr)
}

function getJSON(path) {
  let invalid = getRpkiRank('../join_as_info_output/invalid'+path+'.json')
  let valid = getRpkiRank('../join_as_info_output/valid'+path+'.json')
  let notfound = getRpkiRank('../join_as_info_output/notfound'+path+'.json')
  let RpkiCountryRank = {
    valid,
    invalid,
    notfound
  }
  fs.writeFile('get-rpki-country-rank-'+path+'.json',JSON.stringify(RpkiCountryRank))
}
let v4Rank = 'v4';
let v6Rank = 'v6';

getJSON(v4Rank)
getJSON(v6Rank)