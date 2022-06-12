RPKI.json:
    https://blog.cloudflare.com/cloudflares-rpki-toolkit/
roa.csv:
    (https://ftp.ripe.net/rpki/) 

cs_info.csv:
https://bgp.potaroo.net/cidr/autnums.html

#### 1. 
        cd getVdata 
        python raw2rpki.py 
    input: 
        ../../Phoenix/data/rrc00/2022.05/bview.20220524.0000.data
    output:
        prefix2as_full.data
#### 2. 
        cd getVdata 
        python RPKI_verify.py  
    input: 
        prefix2as_full.data
    output:
        v4_full.data
        v6_full.data
#### 3. python join_as_info.py
    input:
        v4_full.data
        v6_full.data(带{1045}格式的数据需要转成1045)
    output:
        country_valid_rank.data

#### api.getRpkiPrefix: 来源
    node getRpkiPrefix.js (更新rpki.json)

#### 更新AsInfo数据：
    详见getAsInfo的文件夹

