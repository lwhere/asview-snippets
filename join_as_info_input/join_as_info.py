import pandas as pd

# INPUT_NAME = 'v4_full'
INPUT_NAME = 'v4'  #! v6时，应注意v6.data中的数据应该不包含{}


varified = pd.read_csv('./data/'+INPUT_NAME+'.data',names=['prefix','as','rpki'])
# print(varified)
# print(varified['rpki'].value_counts())
asInfo = pd.read_csv('./join_as_info_input/as_info.csv')


# ! asn号向shortName('SD')的映射

# ! 这个set_index('as')设置的真的绝了！
asn2shortName = pd.read_csv('./join_as_info_input/as_info.csv', usecols=['as', 'country']).set_index('as')
shortNameArr = {}
for asn, shortName in asn2shortName.items():
    shortNameArr = shortName
   
            
    # shortNameArr[asn] = shortName
# print(shortNameArr)


dataframe = pd.merge(varified,asInfo,how='left')

statistics = list()
import json
with open('./join_as_info_input/cctoname.json','r',encoding='utf-8')as f:
    ccname = json.load(f)
with open('./join_as_info_input/as_country_position.json','r',encoding='utf-8')as f:
    position = json.load(f)
# print(ccname)
groups= dataframe.groupby('as')
for asn,group in groups:
    # print(name)
    # print(group)
    # counts = group.value_counts()
    count = dict(group['rpki'].value_counts())
    # print(count)
    try:
        # !这里的shortName是国家编号
        # !（比如shortName = 'SD', 对应的ccname[shortName] = 苏丹），需要把asn转化成shortName
        count['country'] = ccname[shortNameArr[asn]]
        # print(shortNameArr[asn])
        
        # 输出为as号的数据
        count['as']=asn
        # print(asn)
        
        if not 'notfound' in count.keys():
            count['notfound']=0
        if not 'valid' in count.keys():
            count['valid'] = 0
        if not 'invalid' in count.keys():
            count['invalid']=0
        # ##经纬度
        count['longitude'] = position[ccname[shortNameArr[asn]]][0]
        count['latitude'] = position[ccname[shortNameArr[asn]]][1]
        #####
        statistics.append(count)
    except Exception as e:
        # print(e.__traceback__)
        continue

# print(statistics)

statistics.sort(key=lambda x:x.get('valid'),reverse=True)
###经纬度
valid_list = list()
invalid_list = list()
notfound_list = list()
for item in statistics:
    valid = dict()
    valid['country'] = item.get('country')
    valid['as'] = item.get('as')
    valid['count'] = item.get('valid')
    valid['longitude'] = item.get('longitude')
    valid['latitude'] = item.get('latitude')
    valid_list.append(valid)

    invalid = dict()
    invalid['country'] = item.get('country')
    invalid['as'] = item.get('as')
    invalid['count'] = item.get('invalid')
    invalid['longitude'] = item.get('longitude')
    invalid['latitude'] = item.get('latitude')
    invalid_list.append(invalid)

    notfound = dict()
    notfound ['country'] = item.get('country')
    notfound ['as'] = item.get('as')
    notfound ['count'] = item.get('notfound')
    notfound ['longitude'] = item.get('longitude')
    notfound ['latitude'] = item.get('latitude')
    notfound_list.append(notfound)
with open('./join_as_info_output/valid'+INPUT_NAME+'.json','w',encoding='utf8') as f:
    f.writelines(str(valid_list).replace('\'','\"'))
with open('./join_as_info_output/invalid'+INPUT_NAME+'.json','w',encoding='utf8') as f:
    f.writelines(str(invalid_list).replace('\'','\"'))
with open('./join_as_info_output/notfound'+INPUT_NAME+'.json','w',encoding='utf8') as f:
    f.writelines(str(notfound_list).replace('\'','\"'))
with open('./join_as_info_output/country_valid_rank'+INPUT_NAME+'.data','w') as f:
    f.write(str(statistics))
###
# print(statistics[:20])
statistics.sort(key=lambda x:x.get('invalid'),reverse=True)         
###
# with open('country_invalid_rank.data','w') as f:
#     f.write(str(statistics))
###
# print(statistics[:20])

statistics.sort(key=lambda x:x.get('notfound'),reverse=True)
# print(statistics[:20])


