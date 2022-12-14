var express = require('express');
var router = express.Router();
const mdb = require('../matchDB/modules/dbOperator');
const fs = require('fs/promises')
const contextCheck = require('../matchDB/modules/contextCheck')

/* GET users listing. */
router.post('/', function(req, res, next) {
    const context = req.body;
    // check context
    const checkResult = contextCheck('dbNormalize',context)
    if (!checkResult.result){
        res.status(400)
        return res.send({
            status:411,
            msg:checkResult.msg
        })
    }
    // operation
    dbNormalize(context).then(()=>console.log('An database has been normalized'))


    //function
    async function dbNormalize(context) {
        try{
            const dbName = context.dbName
            await  fs.rm(`./matchDB/matchDB_root/${dbName}`,{force:true,recursive:true})
            await fs.mkdir(`./matchDB/matchDB_root/${dbName}`)
            const dbConfig = mdb.dbConfigNormalize(context)
            await  fs.writeFile(`./matchDB/matchDB_root/${dbName}/db_cnf.json`,dbConfig)
            await mdb.updateRootConfig()
            return res.send({
                status:200,
                msg:`normalize database:${context.dbName}`
            })
        }catch(e){
            res.status(500)
            return res.send({
                status:500,
                msg:`fail to normalize database:${context.dbName}---${e}`
            })
        }

    }
});


module.exports = router;