let NodeList = document.querySelectorAll('a');
let jsonArr = [];
for(let item of Array.from(NodeList)) {
  
  let as = Number(item.innerHTML.slice(2))
  let word = item.nextSibling.textContent.split(', ')
  let org = word[0];
  let country = word[1].split('\n')[0];
  
  jsonArr.push({as, org, country})
}
console.log(JSON.stringify(jsonArr))

// 访问https://bgp.potaroo.net/cidr/autnums.html，获取到最新的html数据到本地
// 1.将getAsData.js这段脚本插入到最新的html页面中，运行chrome浏览器
// 2.在控制台获取到json对象，再把它复制到as_info.json中，
// 3.然后使用json2csv -i as_info.json -o as_info.csv 将其转化为csv文件(需要安装json2csv这个依赖包, node环境为18)

