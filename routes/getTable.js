var express = require('express');
var router = express.Router();
const mdb = require('../matchDB/modules/dbOperator');
const contextCheck = require('../matchDB/modules/contextCheck')

/* GET users listing. */
router.get('/', function(req, res, next) {
    console.log("GET:")
    console.log(req.query);
    console.log(req.body);
    const context = (Object.keys(req.query).length !== 0) ? req.query : req.body;
    // Check Context
    const checkResult = contextCheck('getTable',context)
    if (!checkResult.result){
        res.status(400)
        return res.send({
            status:441,
            msg:checkResult.msg
        })
    }
    // Operation
    getTable(context).then(()=>console.log('An getTable request has been handled'))

    // Function
    async function getTable(context) {
        try{
            const rootConfig = await mdb.readRootConfig()
            if (!(rootConfig.database.includes(context.db))){
                throw new Error("443")
            }
            const dbConfig = await mdb.readDatabaseConfig(context.db)
            if (!(dbConfig.table.includes(context.table))){
                throw new Error("444")
            }
            const tableObj = await mdb.readTable(context.db,context.table)
            return res.send(tableObj)
        }catch(e){
            console.log(e.message)
            switch (e.message){
                case "443":
                    res.status(400)
                    return res.send({
                        status:443,
                        msg:`database ${context.db} is not existed`
                    })
                    break;
                case "444":
                    res.status(400)
                    return res.send({
                        status:444,
                        msg:`table ${context.table} is not existed`
                    })
                    break;
            }

            res.status(500)
            return res.send({
                status:442,
                msg:`fail to get table---${e.message}`
            })
        }
    }

});


module.exports = router;