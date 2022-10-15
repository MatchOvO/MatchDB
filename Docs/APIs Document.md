# MatchDB数据库API文档
## Workbench
### API：`/`
* 请求类型: `GET`

Workbench用于访问数据库的后台管理系统，MatchDB的Workbench为数据库的管理提供可视化的界面，可以让后台管理者通过简便的可视化方式去操作和管理数据库。
此API是为浏览器提供访问页面的接口，有多种方式来向外暴露此接口，MatchDB开发者建议你通过nginx等web服务反向代理至MatchDB所运行的端口（默认：3020）
***
## APIs
### `/rootNormalize`
* 请求类型: `POST`
* 请求体类型: No need
* 请求参数: No need
```
//请求试例
axios.post('http://localhost:3020/rootNormalize')

//成功返回
{
    status:200,
    msg:"normalize MatchDB's root"    
}
//失败返回
{
    status:500,
    msg:"fail to normalize MatchDB's root"    
}
```
###  `/dbNormalize`
* 请求类型: `POST`
* 请求体类型: `JSON | Urlencoded`
* 请求参数: 
  * dbName: `String`
    * 初始化数据库的名字
```
//请求试例
axios.post('http://localhost:3020/dbNormalize',{
    dbName:"db_01"
})

//成功返回
{
    status:200,
    msg:"normalize database:db_01"    
}
//失败返回
{
    status:411,
    msg:"[MatchDB]: post or context format error,please use JSON to post or use the correct context format"    
}
```
###  `/createTable`
* 请求类型: `POST`
* 请求体类型: `JSON ｜ Urlencoded`
* 请求参数:
    * db: `String`
      * 需要操作的数据库的名字
    * tableName: `String`
      * 需要创建的表格名称
    * format: `Array`
      * 创建的表格中需要包含的字段（属性）
      * 加入的数据包含且只能包含格式（format）中的字段
```
//请求试例
axios.post('http://localhost:3020/dbNormalize',{
    db:"db_01",
    tableName:"users",
    format:["name","gender","age"]
})

//成功返回
{
    status:200,
    msg:"creat table:{tableName}"    
}
//失败返回--请求体格式错误示例
{
    status:421,
    msg:"[MatchDB]:Property {format} is needed and it is needed as an Array"    
}
```

###  `/addData`
* 请求类型: `POST`
* 请求体类型: `JSON ｜ Urlencoded`
* 请求参数:
    * db: `String`
        * 需要操作的数据库的名字
    * table: `String`
        * 需要操作的表格名称
    * data: `Object`
        * 插入的数据对象，以键值对的形式
        * 当请求插入的数据对象中没有包含表格中的列名（属性），则会被赋予空字符串
        * 当请求插入的数据对象中具有表格中没有的字段的数据，该字段的数据将会被忽略
        * 当请求插入的数据不包含 "_id"，则MatchDB将会为你的数据自动加入一个随机生成的唯一id
        * "_id"在同一个表格中必需唯一，否则将无法添加数据，通过"_id"查找数据在MatchDB中会更加高效，即使MatchDB为每一个数据都建立了索引，但是MatchDB作者仍然建议您使用用户名等唯一标识来作为ID值
            并且这也也可以保证数据的唯一性
```
//请求试例
axios.post('http://localhost:3020/dbData',{
    db:"db_01",
    table:"users",
    data:{
        "name":"火柴",
        "age":19,
        "gender":"男"
    }
})

//成功返回
{
    status:200,
    msg:"added an data in {table}"    
}
//失败返回--id已被占用示例
{
    status:431,
    msg:"[MatchDB]:fail to create table--- _id has been used"    
}
```
###  `/deleteData`
* 请求类型: `POST`
* 请求体类型: `JSON ｜ Urlencoded`
* 请求参数:
    * db: `String`
        * 需要操作的数据库的名字
    * table: `String`
        * 需要操作的表格名称
    * _id: `Array | String | Number`
      * 需要删除的id
      * 如果作为一个数组传递参数，里面包含有对象等其它非法元素，MachDB不会对此行为进行检测，也不会对此进行忽略，将会对元素进行字符串化并正常进行删除操作（如果匹配有正确的_id的话）
        * Number ==> String
        * Object ==> "[object,object]" (某种情况下Array也会转为此形式)
        * Array ==> "num1,num2,num3...." (当Array的元素全为数字时)

###  `/getData`
* 请求类型: `GET | POST`
* 请求体类型: `URL | JSON ｜ Urlencoded`
* 请求参数:
    * db: `String`
        * 需要操作的数据库的名字
    * table: `String`
        * 需要查询的表格名称
    * _id: `Array | String`
* 返回类型: `JSON-Array`
* 返回参数:
    * 返回的数据为一个包含查询到的所有数据的数组

###  `/getTable` （实际生产中不建议使用）
* 请求类型: `GET`
* 请求体类型: `URL | JSON ｜ Urlencoded`
* 请求参数:
    * db: `String`
        * 需要操作的数据库的名字
    * table: `String`
        * 需要查询的表格名称
* 返回类型: `JSON-Object`
* 返回参数: 
  * tableInfo: `Object`
    * 包含表格的基本信息
  * data: `Object`
    * 表格中的所有数据
  * index: `Object`
    * 表格中每个列（column）的id索引
#### 返回数据示例（JSON）
```json
{
    "tableInfo": {
        "tableName": "users",
        "size": 2,
        "format": [
            "_id",
            "name",
            "age",
            "address"
        ]
    },
    "data": {
        "818ca99e-71a0-405d-b09e-eb560ab79fc4": {
            "_id": "818ca99e-71a0-405d-b09e-eb560ab79fc4",
            "name": "火柴",
            "age": 19,
            "address": "吉林大学"
        },
        "bc293093-40f0-45f8-8232-94ea597a4cbd": {
            "_id": "bc293093-40f0-45f8-8232-94ea597a4cbd",
            "name": "桃子",
            "age": 19,
            "address": "广州大学"
        }
    },
    "index": {
        "_id": {
            "818ca99e-71a0-405d-b09e-eb560ab79fc4": [
                "818ca99e-71a0-405d-b09e-eb560ab79fc4"
            ],
            "bc293093-40f0-45f8-8232-94ea597a4cbd": [
                "bc293093-40f0-45f8-8232-94ea597a4cbd"
            ]
        },
        "name": {
            "火柴": [
                "818ca99e-71a0-405d-b09e-eb560ab79fc4"
            ],
            "桃子": [
                "bc293093-40f0-45f8-8232-94ea597a4cbd"
            ]
        },
        "age": {
            "19": [
                "bc293093-40f0-45f8-8232-94ea597a4cbd",
                "818ca99e-71a0-405d-b09e-eb560ab79fc4"
            ]
        },
        "address": {
            "吉林大学": [
                "818ca99e-71a0-405d-b09e-eb560ab79fc4"
            ],
            "广州大学": [
                "bc293093-40f0-45f8-8232-94ea597a4cbd"
            ]
        }
    }
}
```

###  `/getTableData` （实际生产中不建议使用）
* 请求类型: `GET`
* 请求体类型: `URL | JSON ｜ Urlencoded`
* 请求参数:
    * db: `String`
        * 需要操作的数据库的名字
    * table: `String`
        * 需要查询的表格名称
* 返回类型: `JSON-Object`
* 返回参数:
  * 表格中的所有数据---id为键值的数据对象
#### 返回数据示例（JSON）
```json
{
  "818ca99e-71a0-405d-b09e-eb560ab79fc4": {
    "_id": "818ca99e-71a0-405d-b09e-eb560ab79fc4",
    "name": "火柴",
    "age": 19,
    "address": "吉林大学"
  },
  "bc293093-40f0-45f8-8232-94ea597a4cbd": {
    "_id": "bc293093-40f0-45f8-8232-94ea597a4cbd",
    "name": "桃子",
    "age": 19,
    "address": "广州大学"
  }
}
```

###  `/updateData`
* 请求类型: `POST`
* 请求体类型: `JSON ｜ Urlencoded`
* 请求参数:
    * db: `String`
        * 需要操作的数据库的名字
    * table: `String`
        * 需要操作的表格名称
    * _id: `Array | String | Number`
        * 需要删除的id
        * 对于_id的处理方式同 [/deleteData]()一样
    * field: `Object`
      * 需要更新的字段
      * 以需要更新的字段作为键(key)，更新的值作为值(value)
      * table中format格式不包含的字段将会被忽略
* 返回类型: `JSON--Array`
* 返回参数:
  * 返回的数据为一个包含被修改的所有数据的数组

###  `/getWhere`
* 请求类型: `POST`
* 请求体类型: `JSON ｜ Urlencoded`
* 请求参数:
    * db: `String`
        * 需要操作的数据库的名字
    * table: `String`
        * 需要操作的表格名称
    * _id: `Array | String | Number`
        * 需要删除的id
        * 对于_id的处理方式同 [/deleteData]()一样
    * where: `Object`
        * 需要查询的字段
        * 以需要查询的字段作为键(key)，查询的值作为值(value)
        * table中format格式不包含的字段将会被忽略
* 返回类型: `JSON--Array`
* 返回参数:
    * 返回的数据为一个包含被修改的所有数据的数组