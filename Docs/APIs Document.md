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
* 请求体类型: `JSON | urlencoded`
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
* 请求体类型: `JSON ｜ Object`
* 请求参数:
    * db: `String`
      * 需要操作的数据库的名字
    * tableName: `String`
      * 需要创建的表格名称
    * format: `Array`
      * 创建的表格中需要包含的列名（属性）
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
* 请求体类型: `JSON ｜ Object`
* 请求参数:
    * db: `String`
        * 需要操作的数据库的名字
    * table: `String`
        * 需要操作的表格名称
    * data: `Object`
        * 插入的数据对象，以键值对的形式
        * 当请求插入的数据对象中没有包含表格中的列名（属性），则会被赋予空字符串
        * 当请求插入的数据不包含 "_id"，则MatchDB将会为你的数据自动加入一个随机生成的唯一id
        * "_id"在同一个表格中必需唯一，否则将无法添加数据，通过"_id"查找数据在MatchDB中会更加高效，因此建议MatchDB开发者建议您使用用户名等唯一标识来作为ID值
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