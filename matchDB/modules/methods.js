const fs = require('fs/promises')
const uuid = require('uuid')
class matchDB{
    constructor(config) {
        this.config = config
        /**
         *  There's some Async function that need to return a value
         * */
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

        this.readForm = function (db,form) {
            return new Promise((resolve,reject)=>{
                let formObj
                async function handler(){
                    try{
                        formObj = JSON.parse(await fs.readFile(`./matchDB/matchDB_root/${db}/${form}`,'utf8'))
                        resolve(formObj)
                    }catch (e) {
                        reject(e)
                    }
                }
                handler().then()
            })
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
        switch (operation){
            case 'dbNormalize':
                if(!context.hasOwnProperty('dbName')) return {result:false,msg:'[MatchDB]:Property {dbName} is needed'};
                if (context.dbName === '') return  {result:false,msg:'[MatchDB]:Property {dbName} can not be empty'};
                break;
            case 'createForm':
                if(!context.hasOwnProperty('db')) return {result:false,msg:'[MatchDB]:Property {db} is needed'};
                if (context.db === '') return  {result:false,msg:'[MatchDB]:Property {db} can not be empty'};
                if(!context.hasOwnProperty('formName')) return {result:false,msg:'[MatchDB]:Property {formName} is needed'};
                if (context.formName === '') return  {result:false,msg:'[MatchDB]:Property {formName} can not be empty'};
                if(!context.hasOwnProperty('format') || !Array.isArray(context.format)) return {result:false,msg:'[MatchDB]:Property {format} is needed and it is needed as an Array'};
                if (context.format.length === 0) return  {result:false,msg:'[MatchDB]:Property {format} can not be an empty Array'};
                if (context.format.includes('mdbID')) return  {result:false,msg:'[MatchDB]:Property {format} Array can not includes an value called {mdbID}'};
                break;
            case 'addData':
                if(!context.hasOwnProperty('db')) return {result:false,msg:'[MatchDB]:Property {db} is needed'};
                if (context.db === '') return  {result:false,msg:'[MatchDB]:Property {"db"} can not be empty'};
                if(!context.hasOwnProperty('form')) return {result:false,msg:'[MatchDB]:Property {form} is needed'};
                if (context.form === '') return  {result:false,msg:'[MatchDB]:Property {form} can not be empty'};
                if(!context.hasOwnProperty('data')) return {result:false,msg:'[MatchDB]:Property {data} is needed'};
                if (!(context.data.constructor === Object)) return {result:false,msg:'[MatchDB]:Property {data} should be an Object'};
        }
        return {result}
    }

    dbConfigNormalize(context) {
        const configObj = {
            dbInfo:{
                dbName:context.dbName,
                size:0
            },
            form:[]
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

    formNormalize(context) {
        const dataObj = {
            formInfo:{
                formName:context.formName,
                size:0,
                format:['mdbID',...context.format]
            },
            data:[]
        }
        return JSON.stringify(dataObj)
    }

    dataCompose(contextData,dataFormat){
        contextData.mdbID = uuid()
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
                dbConfig.form = newList
                await fs.writeFile(`./matchDB/matchDB_root/${db}/db_cnf.json`,JSON.stringify(dbConfig))
            }catch (e) {
                throw new Error(e.message)
            }
        }
        return handler()
    }

    updateFormInfo(formInfo,size){
        formInfo.size = size
        return formInfo
    }

    createForm(context){
        const newForm = this.formNormalize(context)
        const updateDatabaseConfig = this.updateDatabaseConfig
        const readDatabaseConfig = this.readDatabaseConfig(context.db)
        async function handler(){
            try {
                const path = `./matchDB/matchDB_root/${context.db}/${context.formName}`
                const dbConfig = await readDatabaseConfig
                if (!(dbConfig.form.includes(context.formName))){
                    await Promise.all([
                        fs.writeFile(path,newForm),
                        updateDatabaseConfig(context.db)
                    ])
                }else{
                    throw new Error(`[MatchDB]: ${context.formName} has been existing`)
                }
            }catch (e) {
                throw new Error(e.message)
            }
        }
        return handler()
    }

    addData(context){
        const {db,form} = context
        const contextData = context.data
        const readForm = this.readForm(db,form)
        const dataCompose = this.dataCompose
        const updateFormInfo = this.updateFormInfo
        async function handler(){
            try {
                let {formInfo,data} = await readForm
                const dataFormat = formInfo.format
                const newData = dataCompose(contextData,dataFormat)
                data.unshift(newData)
                formInfo = updateFormInfo(formInfo,data.length)
                const newForm = {
                    formInfo,
                    data
                }
                await fs.writeFile(`./matchDB/matchDB_root/${db}/${form}`,JSON.stringify(newForm))
            }catch (e) {
                throw new Error(e)
            }
        }
        return handler()
    }
}
module.exports = new matchDB()