import fetchline from 'fetchline'
import fs from 'fs'


// let dataSets = ['apnic', 'afrinic', 'lacnic', 'ripencc', 'arin'];
let dataSets = ['arin'];
// let months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
// let months = ['01', '02', '03', '04', '05', '06']
let months = ['05', '06']

// 生成时间序列
function getTime(year, months) {
  let nums = [];
  for (let month of months) {
    let date = `${year}/${month}/01/`;
    nums.push(date)
  }
  return JSON.stringify(nums);
}

// 生成链接序列
function getUrls(dataSets, months, year) {
  let urls = []
  for (let dataSet of dataSets) {
    for (let month of months) {
      urls.push(`https://ftp.ripe.net/rpki/${dataSet}.tal/${year}/${month}/01/roas.csv`)
    }
  }
  return urls
}


// 输出各个月份的数据
async function getAsyncValue(url) {

  let iterator = await fetchline(url)
  // let res = await fetch(url);
  let num = -2; // 第一行为列名
  try {
    for await (const line of iterator) {
      num++;
      if (num % 10000 === 0) {
        console.log(line)
      }
    }

    // // ! 很奇怪，如果不打印line的话，num值可能不正确
    // // ! 而且执行顺序很有可能乱序
    // // ! 阅读一下源码，将这个改成顺序执行
    // console.log(url)
    // console.log(res.body.getReader())
  } catch {
    err => {
      console.log("Error!" + err)
    }
  }
  console.log(num)
  return num;
}

function main(urls) {
  let index = 0;
  let data = []; // 
  let nums = []; //
  urls.forEach(async (url) => {
    let num = await getAsyncValue(url)
    data.push(num)

    async function pushToNums(monthSum) {
      index++;
      if (index % monthSum === 0) {
        let nameIndex = Math.floor((index - 1) / monthSum);
        let obj = {
          name: dataSets[nameIndex],
          data
        }
        nums.push(obj)
        console.log(nums)
        fs.writeFileSync('./Global.json', JSON.stringify(nums))
        data = [];
      }

    }

    await pushToNums(months.length)
  })
  // !一次写入 不知道为啥，在这就直接不太行了
  // console.log(nums)
  // fs.writeFileSync('./Global.json', JSON.stringify(nums))
}
// 生成url
let urls = getUrls(dataSets, months, 2022)
// 爬取数据
main(urls)
// 输出Time
console.log(getTime(2022, months))


//? 改进：更优雅的拼接方式？
