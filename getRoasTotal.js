// 请求 url - > html（信息）  -> 解析html
const https = require('https');
const cheerio = require('cheerio');
const fs = require('fs');
// 请求 top250
// 浏览器输入一个 url, get

const targetArr = ['apnic', 'afrinic', 'lacnic', 'ripencc', 'arin']


function getJsonFromPage(url) {
    https.get(url, function (res) {
    // console.log(res);
    // 分段返回的 自己拼接
    let html = '';
    // 有数据产生的时候 拼接
    res.on('data', function (chunk) {
        html += chunk;
    })
    // 拼接完成
    res.on('end', function () {
        const $ = cheerio.load(html);
        let allFilms = [];
        $('li').each(function () {

            // let nameList = $('a', this).text();
            // let name = nameList.split('.')[0].split(' ')[1]
            
            // if (targetArr.includes(name)) { // 只读targetArr中的那些元素
                
            //     const href = $('a', this).attr('href');
            //     allFilms.push({
            //         name, href
            //     })
            //     getJsonFromPage(url+href)
            // }
            
            // roas.csv处理
            let item = $('a', this)
            let name = item.text();
            if(name === 'roas.csv'){
                item.attr('download', 'test')
            }
        })
        // 把数组写入json里面
        // fs.writeFile('./total.json', JSON.stringify(allFilms), function (err) {
        //     if (!err) {
        //         console.log('文件写入完毕');
        //     }
        // })
        // // 图片下载一下
        // downloadImage(allFilms);
    })
})
}

// let url = 'https://ftp.ripe.net/rpki/'
let url = 'https://ftp.ripe.net/rpki/lacnic.tal/2022/05/01/'
getJsonFromPage(url)

// 思路1：
// 1. 直接遍历下载url的csv文件，然后读取行数
// 2. 变量：1.lacnic.tal 2: 从 01 -> 05



