// 访问https://bgp.potaroo.net/cidr/autnums.html，获取到最新的html数据到本地
// 1.将getAsData.js这段脚本插入到最新的html页面中，运行chrome浏览器
// 2.在控制台获取到json对象，再把它复制到as_info.json中，
// 3.然后使用json2csv -i as_info.json -o as_info.csv 将其转化为csv文件(需要安装json2csv这个依赖包, node环境为18)



<!-- 教训
  1. 不要为了直接得到想要的数据结构来编程
  2. 而是先按照自己的想法获得数据，然后再convertData一下
 -->