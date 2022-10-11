const fs = require('fs/promises')
const fsN = require('fs')
const uuid = require('uuid')
class matchDB{
    constructor(config) {
        this.config = config
        /**
         *  There's some Async function that need to return a value
         * */
        this.readRootConfig = function () {
            return new Promise((resolve, reject) => {
                let rootConfig
                async function handler(){
                    try{
                        rootConfig = JSON.parse(await fs.readFile(`./matchDB/matchDB_root/root_cnf.json`,'utf8'))
                        resolve(rootConfig)
                    }catch (e) {
                        reject(e)
                    }
                }
                handler().then()
            })
        }

        this.readDatabaseConfig = function (db) {
            return new Promise((resolve, reject)=>{
                let dbConfig
                async function handler(){
                    try{
                        dbConfig = JSON.parse(await fs.readFile(`./matchDB/matchDB_root/${db}/db_cnf.json`,'utf8'))
                        resolve(dbConfig)
                    }catch (e) {
                        reject(e)
                    }
                }
                handler().then()
            })
        }

        this.readTable = function (db, table) {
            return new Promise((resolve,reject)=>{
                let tableObj
                async function handler(){
                    try{
                        tableObj = JSON.parse(await fs.readFile(`./matchDB/matchDB_root/${db}/${table}`,'utf8'))
                        resolve(tableObj)
                    }catch (e) {
                        reject(e)
                    }
                }
                handler().then()
            })
        }

        this.readTableSync = function (db,table) {
            return JSON.parse(fsN.readFileSync(`./matchDB/matchDB_root/${db}/${table}`,'utf8'))
        }
    }

/**
 *  No Async operation or Async function that no need to return a value
 * */

    /**
     *  Check the context's format
     */
    contextCheck(operation,context){
        let result = true
        if (context.constructor !== Object) return `[MatchDB]: post or context format error,please use JSON to post or use the correct context format`
        switch (operation){
            case 'dbNormalize':
                if(!context.hasOwnProperty('dbName')) return {result:false,msg:'[MatchDB]:Property {dbName} is needed'};
                if (context.dbName.constructor !== String) return  {result:false,msg:'[MatchDB]:Property {dbName} should be an String'};
                if (context.dbName === '') return  {result:false,msg:'[MatchDB]:Property {dbName} can not be empty'};
                break;
            case 'createTable':
                if(!context.hasOwnProperty('db')) return {result:false,msg:'[MatchDB]:Property {db} is needed'};
                if (context.db.constructor !== String) return  {result:false,msg:'[MatchDB]:Property {db} should be an String'};
                if (context.db === '') return  {result:false,msg:'[MatchDB]:Property {db} can not be empty'};
                if(!context.hasOwnProperty('tableName')) return {result:false,msg:'[MatchDB]:Property {tableName} is needed'};
                if (context.tableName.constructor !== String) return  {result:false,msg:'[MatchDB]:Property {formName} should be an String'};
                if (context.tableName === '') return  {result:false,msg:'[MatchDB]:Property {formName} can not be empty'};
                if(!context.hasOwnProperty('format') || !Array.isArray(context.format)) return {result:false,msg:'[MatchDB]:Property {format} is needed and it is needed as an Array'};
                if (context.format.length === 0) return  {result:false,msg:'[MatchDB]:Property {format} can not be an empty Array'};
                break;
            case 'addData':
                if(!context.hasOwnProperty('db')) return {result:false,msg:'[MatchDB]:Property {db} is needed'};
                if (context.db.constructor !== String) return  {result:false,msg:'[MatchDB]:Property {db} should be an String'};
                if (context.db === '') return  {result:false,msg:'[MatchDB]:Property {"db"} can not be empty'};
                if(!context.hasOwnProperty('table')) return {result:false,msg:'[MatchDB]:Property {table} is needed'};
                if (context.table.constructor !== String) return  {result:false,msg:'[MatchDB]:Property {table} should be an String'};
                if (context.table === '') return  {result:false,msg:'[MatchDB]:Property {table} can not be empty'};
                if(!context.hasOwnProperty('data')) return {result:false,msg:'[MatchDB]:Property {data} is needed'};
                if (!(context.data.constructor === Object)) return {result:false,msg:'[MatchDB]:Property {data} should be an Object'};
                if ((context.data.hasOwnProperty("_id"))){
                    if ((context.data._id.constructor !== String) && (context.data._id.constructor !== Number)) return {result:false,msg:'[MatchDB]:Data\'s Property {_id} should be an String or Number'};
                }
                break;
            case 'getTable':
                if(!context.hasOwnProperty('db')) return {result:false,msg:'[MatchDB]:Property {db} is needed'};
                if (context.db.constructor !== String) return  {result:false,msg:'[MatchDB]:Property {db} should be an String'};
                if (context.db === '') return  {result:false,msg:'[MatchDB]:Property {"db"} can not be empty'};
                if(!context.hasOwnProperty('table')) return {result:false,msg:'[MatchDB]:Property {table} is needed'};
                if (context.table.constructor !== String) return  {result:false,msg:'[MatchDB]:Property {table} should be an String'};
                if (context.table === '') return  {result:false,msg:'[MatchDB]:Property {table} can not be empty'};
                break;
            case 'deleteData':
                if(!context.hasOwnProperty('db')) return {result:false,msg:'[MatchDB]:Property {db} is needed'};
                if (context.db.constructor !== String) return  {result:false,msg:'[MatchDB]:Property {db} should be an String'};
                if (context.db === '') return  {result:false,msg:'[MatchDB]:Property {"db"} can not be empty'};
                if(!context.hasOwnProperty('table')) return {result:false,msg:'[MatchDB]:Property {table} is needed'};
                if (context.table.constructor !== String) return  {result:false,msg:'[MatchDB]:Property {table} should be an String'};
                if (context.table === '') return  {result:false,msg:'[MatchDB]:Property {table} can not be empty'};
                if (!context.hasOwnProperty('_id')) return {result:false,msg:'[MatchDB]:Property {_id} is needed'};
                if (context._id.constructor !== String && context._id.constructor !== Array) return {result:false,msg:'[MatchDB]:Property {_id} should be an String or an Array'};
                break;
        }
        return {result}
    }

    dbConfigNormalize(context) {
        const configObj = {
            dbInfo:{
                dbName:context.dbName,
                size:0
            },
            table:[]
        }
        return JSON.stringify(configObj)
    }

    rootConfigNormalize(context){
        const configObj = {
            dbInfo:{
                size:0
            },
            database:[]
        }
        return JSON.stringify(configObj)
    }

    tableNormalize(context) {
        const formatArr = [...new Set(['_id',...context.format])]
        const dataObj = {
            tableInfo:{
                tableName:context.tableName,
                size:0,
                format:formatArr
            },
            data:{},
            index:{}
        }
        formatArr.forEach(item=>{
            dataObj.index[item] = {}
        })
        return JSON.stringify(dataObj)
    }

    dataCompose(contextData,dataFormat){
        if (!contextData.hasOwnProperty("_id")){
            contextData._id = uuid()
        }else if(!(contextData._id.constructor === String)){
            contextData._id = contextData._id.toString()
        }
        let newData = {}
        dataFormat.forEach((element)=>{
            if (contextData[element]){
                newData[element] = contextData[element]
            }else{
                newData[element] = ''
            }
        })
        return newData
    }

    updateRootConfig(){
        async function handler(){
            try{
                const oldList =await fs.readdir('./matchDB/matchDB_root/')
                const rootConfigStr = await fs.readFile('./matchDB/matchDB_root/root_cnf.json','utf8')
                const rootConfig = JSON.parse(rootConfigStr)
                rootConfig.dbInfo.size = oldList.length - 1
                const newList = oldList.filter(e=>e !== 'root_cnf.json')
                console.log(newList)
                rootConfig.database = newList
                await fs.writeFile(`./matchDB/matchDB_root/root_cnf.json`,JSON.stringify(rootConfig))
            }catch (e) {
                throw new Error(e.message)
            }
        }
        return handler()
    }

    updateDatabaseConfig(db){
        async function handler(){
            try {
                const oldList =await fs.readdir(`./matchDB/matchDB_root/${db}/`)
                const dbConfigStr = await fs.readFile(`./matchDB/matchDB_root/${db}/db_cnf.json`,'utf8')
                const dbConfig = JSON.parse(dbConfigStr)
                dbConfig.dbInfo.size = oldList.length - 1
                const newList = oldList.filter(e=>e !== 'db_cnf.json')
                console.log('new form list'+newList)
                dbConfig.table = newList
                await fs.writeFile(`./matchDB/matchDB_root/${db}/db_cnf.json`,JSON.stringify(dbConfig))
            }catch (e) {
                throw new Error(e.message)
            }
        }
        return handler()
    }

    updateTableInfo(tableInfo, data){
        // 需要旧的tableInfo 新的data
        tableInfo['size'] = Object.getOwnPropertyNames(data).length
    }

    updateTableIndex(tableInfo,data,index){
        // 需要新的tableInfo 新的data 旧的index
        const {format} = tableInfo
        format.forEach(item=>{
            index[item] = {}
        })
        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                const element = data[key];
                format.forEach(item=>{
                    const valueObj = index[item]
                    let value = element[item]
                    if (value.constructor !== String) value = String(value)
                    if (!valueObj[value]) valueObj[value] = [];
                    valueObj[value].unshift(element._id)
                    // 索引数组去重
                    const arr = valueObj[value]
                    const set = new Set(arr)
                    valueObj[value] = [...set]
                })
            }
        }

    }
    /**
     *  Handler
     * */

    createTable(context){
        const newTable = this.tableNormalize(context)
        const updateDatabaseConfig = this.updateDatabaseConfig
        const readDatabaseConfig = this.readDatabaseConfig(context.db)
        async function handler(){
            try {
                const path = `./matchDB/matchDB_root/${context.db}/${context.tableName}`
                const dbConfig = await readDatabaseConfig
                if (!(dbConfig.table.includes(context.tableName))){
                    await Promise.all([
                        fs.writeFile(path,newTable),
                        updateDatabaseConfig(context.db)
                    ])
                }else{
                    throw new Error(`423`)
                }
            }catch (e) {
                throw new Error(e.message)
            }
        }
        return handler()
    }

    addData(context){
        const {db,table} = context
        const contextData = context.data
        const readTable = this.readTable(db,table)
        const dataCompose = this.dataCompose
        const updateTableInfo = this.updateTableInfo
        const updateTableIndex = this.updateTableIndex
        async function handler(){
            try {
                let {tableInfo,data,index} = await readTable
                const dataFormat = tableInfo.format
                const newData = dataCompose(contextData,dataFormat)
                if (data[newData._id]){
                    throw new Error("433")
                }
                data[newData._id] = newData
                updateTableInfo(tableInfo,data)
                updateTableIndex(tableInfo,data,index)
                const newTable = {
                    tableInfo,
                    data,
                    index
                }
                await fs.writeFile(`./matchDB/matchDB_root/${db}/${table}`,JSON.stringify(newTable))
            }catch (e) {
                throw new Error(e.message)
            }
        }
        return handler()
    }

    deleteData(context){
        try{
            const {db,table,_id} = context
            const idArr = _id.constructor === Array ? _id : [_id]
            const tableObj = this.readTableSync(db,table)
            const {tableInfo,data,index} = tableObj
            const deletedArr = []
            idArr.forEach(id=>{
                if (data[id]){
                    deletedArr.push(data[id])
                    delete data[id]
                }
            })
            this.updateTableInfo(tableInfo,data)
            this.updateTableIndex(tableInfo,data,index)
            const newTable = {
                tableInfo,
                data,
                index
            }
            fsN.writeFileSync(`./matchDB/matchDB_root/${db}/${table}`,JSON.stringify(newTable))
            return deletedArr
        }catch (e) {
            return []
            throw new Error(e.message)
        }
    }

}
module.exports = new matchDB()