const fs = require('fs/promises')
const fsN = require('fs')
const uuid  = require('uuid')
const mArr = require('./methods_array')
const Id = require('./IdHandler')
class matchDB{
    constructor() {
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
            contextData._id = String(contextData._id)
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

     idHandler(context){
         const {_id} = context
         const idArr = new Id(_id).idArr()
         return idArr
     }

     updateTable(db,table,tableInfo,data,index){
         const newTable = {
             tableInfo,
             data,
             index
         }
         fsN.writeFileSync(`./matchDB/matchDB_root/${db}/${table}`,JSON.stringify(newTable))
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
        const updateTable = this.updateTable
        async function handler(){
            try {
                let {tableInfo,data,index} = await readTable
                const dataFormat = tableInfo.format
                let newData;
                if (contextData.constructor === Object) {
                    newData = dataCompose(contextData, dataFormat)
                    dataOperator()
                }
                if (contextData.constructor === Array){
                    contextData.forEach(oldData=>{
                        newData = dataCompose(oldData, dataFormat)
                        dataOperator()
                    })
                }
                updateTable(db,table,tableInfo,data,index)
                function dataOperator() {
                    if (data[newData._id]){
                        throw new Error("433")
                    }
                    data[newData._id] = newData
                    updateTableInfo(tableInfo,data)
                    updateTableIndex(tableInfo,data,index)
                }
            }catch (e) {
                throw new Error(e.message)
            }
        }
        return handler()
    }

    deleteData(context,tableObj){
        try{
            const {db,table} = context
            const idArr = this.idHandler(context)
            if (!tableObj) tableObj = this.readTableSync(db,table)
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
            this.updateTable(db,table,tableInfo,data,index)
            return deletedArr
        }catch (e) {
            return []
            throw new Error(e.message)
        }
    }

    getData(context,tableObj){
        try{
            const {db,table} = context
            const idArr = this.idHandler(context)
            if (!tableObj) tableObj = this.readTableSync(db,table)
            const {data} = tableObj
            const dataArr = []
            idArr.forEach((id)=>{
                if (data[id]) dataArr.push(data[id])
            })
            return dataArr
        }catch (e) {
            throw new Error(e.message)
        }
    }

    updateData(context){
        try{
            const {db,table,field} = context
            const idArr = this.idHandler(context)
            const {tableInfo,data,index} = this.readTableSync(db,table)
            const updateArr = []
            idArr.forEach(id=>{
                if (data[id]){
                    for (const fieldKey in field) {
                        if (data[id][fieldKey] || data[id][fieldKey] === '') {
                            data[id][fieldKey] = field[fieldKey];
                        }
                    }
                    updateArr.push(data[id])
                }
            })
            this.updateTableInfo(tableInfo,data)
            this.updateTableIndex(tableInfo,data,index)
            this.updateTable(db,table,tableInfo,data,index)
            return updateArr
        }catch (e) {
            throw new Error(e.message)
        }
    }
    //Or 规则的 where查询
    where_or(context, tableObj){
        const {db,table,where} = context
        if (!tableObj) tableObj = this.readTableSync(db,table)
        const {index} = tableObj
        let idArr = []
        for (const fieldKey in where) {
            let fieldValue = where[fieldKey]
            if (fieldValue.constructor !== Array){
                _selector(fieldValue)
            }else{
                fieldValue.forEach(value=>{
                    _selector(value)
                })
            }
            function _selector(fieldValue) {
                // 查询字段不存在则忽略
                if (index[fieldKey]){
                    if (fieldValue.constructor !== String) fieldValue = String(fieldValue)
                    if (index[fieldKey][fieldValue]) {
                        idArr.push(...index[fieldKey][fieldValue])
                    }
                }
            }

        }
        // 去重
        idArr = mArr.distinct(idArr)
        return idArr
    }

    //And 规则的 where查询
    where_and(context, tableObj){
        const {db,table,where} = context
        if (!tableObj) tableObj = this.readTableSync(db,table)
        const {index} = tableObj
        const tempArr = []
        for (const fieldKey in where) {
            let fieldValue = where[fieldKey]
            if (fieldValue.constructor !== Array){
                if (fieldValue.constructor !== String) fieldValue = String(fieldValue)
                if (index[fieldKey]){
                    if (index[fieldKey][fieldValue]) {
                        tempArr.push(index[fieldKey][fieldValue])
                    }else{
                        tempArr.push([])
                    }
                }else{
                    //如果字段在表中不存在，AND运算不可能查询出数据，直接加入一个空数组迫使其查询结果为失败
                    tempArr.push([])
                }
            }else{
                //如果为数组，由于AND运算不可能查询出数据，直接加入一个空数组迫使其查询结果为失败
                tempArr.push([])
            }
        }
        // 求id的重复项
        console.log(tempArr)
        const idArr = mArr.repeat(tempArr)
        return idArr
    }

    getWhere(context){
        try{
            const {db,table} = context
            let mode = 'OR'
            if (context.hasOwnProperty('mode')) mode = context.mode
            const tableObj = this.readTableSync(db,table)
            let idArr = []
            switch (mode){
                case "OR":
                    idArr = this.where_or(context,tableObj)
                    break
                case "AND":
                    idArr = this.where_and(context,tableObj)
                    break
                default:
                    idArr = this.where_or(context,tableObj)
            }
            const dataArr = this.getData({
                db,
                table,
                _id:idArr
            },tableObj)
            return dataArr
        }catch (e) {
            throw new Error(e.message)
        }
    }

    deleteWhere(context){
        try{
            const {db,table} = context
            let mode = 'OR'
            if (context.hasOwnProperty('mode')) mode = context.mode
            const tableObj = this.readTableSync(db,table)
            let idArr = []
            switch (mode){
                case "OR":
                    idArr = this.where_or(context,tableObj)
                    break
                case "AND":
                    idArr = this.where_and(context,tableObj)
                    break
                default:
                    idArr = this.where_or(context,tableObj)
            }
            const deleteArr = this.deleteData({
                db,
                table,
                _id:idArr
            },tableObj)
            return deleteArr
        }catch (e) {
            throw new Error(e.message)
        }
    }
}
module.exports = new matchDB()