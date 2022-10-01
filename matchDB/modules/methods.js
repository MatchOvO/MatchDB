const fs = require('fs/promises')
class matchDB{
    constructor(config) {
        this.config = config

        this.readDatabaseConfig = function readDatabaseConfig(db) {
            return new Promise((resolve, reject)=>{
                let dbConfig
                async function handler(){
                    try{
                        dbConfig = JSON.parse(await fs.readFile(`./matchDB/matchDB_root/${db}/db_cnf.json`,'utf8'))
                        resolve(dbConfig)
                    }catch (e) {
                        reject(e.message)
                    }
                }
                handler().then()
            })
        }
    }

    contextCheck(operation,context){
        let result = true
        switch (operation){
            case 'dbNormalize':
                if(!context.hasOwnProperty('dbName')) return {result:false,msg:'[MatchDB]:Property "dbName" is needed'};
                if (context.dbName === '') return  {result:false,msg:'[MatchDB]:Property "dbName" can not be empty'};
                break;
            case 'createForm':
                if(!context.hasOwnProperty('db')) return {result:false,msg:'[MatchDB]:Property "db" is needed'};
                if (context.db === '') return  {result:false,msg:'[MatchDB]:Property "db" can not be empty'};
                if(!context.hasOwnProperty('formName')) return {result:false,msg:'[MatchDB]:Property "formName" is needed'};
                if (context.formName === '') return  {result:false,msg:'[MatchDB]:Property "formName" can not be empty'};
                break;
            case 'addData':
                if(!context.hasOwnProperty('db')) return {result:false,msg:'[MatchDB]:Property "db" is needed'};
                if (context.db === '') return  {result:false,msg:'[MatchDB]:Property "db" can not be empty'};
                if(!context.hasOwnProperty('form')) return {result:false,msg:'[MatchDB]:Property "form" is needed'};
                if (context.form === '') return  {result:false,msg:'[MatchDB]:Property "form" can not be empty'};
                if(!context.hasOwnProperty('data')) return {result:false,msg:'[MatchDB]:Property "data" is needed'};
                if (typeof context.data !== 'object') return {result:false,msg:'[MatchDB]:Property "data" should be an Object'};
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
                size:0
            },
            data:[]
        }
        return JSON.stringify(dataObj)
    }

    updateRootConfig(){
        async function handler(){
            try{
                const oldList =await fs.readdir('./matchDB/matchDB_root')
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
                const oldList =await fs.readdir(`./matchDB/matchDB_root/${db}`)
                const dbConfigStr = await fs.readFile(`./matchDB/matchDB_root/${db}/db_cnf.json`,'utf8')
                const dbConfig = JSON.parse(dbConfigStr)
                dbConfig.dbInfo.size = oldList.length - 1
                const newList = oldList.filter(e=>e !== 'db_cnf.json')
                console.log(newList)
                dbConfig.database = newList
                await fs.writeFile(`./matchDB/matchDB_root/${db}/db_cnf.json`,JSON.stringify(dbConfig))
            }catch (e) {
                throw new Error(e.message)
            }
        }
        return handler()
    }


    createForm(context){
        const newForm = this.formNormalize(context)
        const updateDatabaseConfig = this.updateDatabaseConfig
        const readDatabaseConfig = this.readDatabaseConfig(context.db)
        async function handler(){
            try {
                const path = `./matchDB/matchDB_root/${context.db}/${context.formName}`
                const dbConfig = await readDatabaseConfig
                if (!(dbConfig.database.includes(context.formName))){
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
        async function handler(){
            try {

            }catch (e) {
                throw new Error(e.message)
            }
        }
        return handler()
    }
}
module.exports = new matchDB()