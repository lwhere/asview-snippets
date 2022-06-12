import fetchline from 'fetchline'
// 这个fetchline的库有点意思，核心源码是fetchline.ts，看看别人是怎么实现并发的吧！
import fs from 'fs'

// 生成时间序列
function getTime(year, months) {
  let nums = [];
  for (let month of months) {
    let date = `${year}/${month}/01/`;
    nums.push(date)
  }
  return nums;
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
async function getAsyncValue(url, year) {

  // 问题1：获取链接失败
  // 问题2：并发执行顺序乱码
  let num = -2; // 第一行为列名
  let dataset = url.split('/rpki/')[1].split('.tal')[0]
  let month = Number(url.split('/01/roas.csv')[0].split(`/${year}/`)[1])
  let iterator = await fetchline(url)

  try {
    for await (const line of iterator) {
      num++;
      // 监控执行过程
      // if (num % 10000 === 0) {
      //   console.log(line)
      // }
    }
  } catch {
    err => {
      console.log("Error!" + err)
    }
  }
  return {
    num,
    dataset,
    month
  };
}

async function main(dataSets, months, year) {

  let urls = getUrls(dataSets, months, year)

  async function getTotalMonth() {
    let totalMonth = []
    let totalLength = dataSets.length * months.length;
    return new Promise((resolve, reject) => {
      urls.forEach(async (url) => {
        let monthObj = await getAsyncValue(url, year)
        console.log(monthObj)
        totalMonth.push(monthObj)
        // 所有数据接收完毕后，resolve返回
        if (totalMonth.length === totalLength) resolve(totalMonth)
      })
    })
  }
  // ! 返回Promise对象的原因是为了保证异步顺序正确
  // ! 不然将会出现非常多奇奇怪怪的现象
  let totalMonth = await getTotalMonth()
  // ! 调整并发顺序
  totalMonth.sort((a, b) => a.month - b.month)

  console.log('totalMonth: ' + totalMonth)
  fs.writeFileSync('./totalMonth.json', JSON.stringify(totalMonth))


  function getNums() {
    // 先n^2解决吧！
    let nums = [];
    dataSets.forEach((dataSet, index) => {
      nums.push({
        name: dataSet,
        data: []
      });
      // ! 调整并发顺序
      totalMonth.forEach(singleMonth => {
        if (singleMonth.dataset === dataSet) {
          nums[index].data.push(singleMonth.num)
        }
      })
    })
    return nums;
  }



  function writeToJson() {
    let time = getTime(year, months)
    let nums = getNums();
    console.log('nums: ', nums)
    let obj = { time, nums }
    fs.writeFileSync(`${year}-global.json`, JSON.stringify(obj))
  }
  writeToJson()
}

let dataSets = ['apnic', 'afrinic', 'lacnic', 'ripencc', 'arin'];
// let test_dataSets = ['arin'];

// let months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
let months = ['01', '02', '03', '04', '05', '06']
// let test_months = ['05', '06']

main(dataSets, months, 2022)
// 输出Time



// 思路1：
// 1. 直接遍历下载url的csv文件，然后读取行数
// 2. 变量：1.lacnic.tal 2: 从 01 -> 05
//? 改进：更优雅的拼接方式？
// 1. 不要面向数据进行编程。
// 2. 而是先获得想要的数据，再进行结构的转化
