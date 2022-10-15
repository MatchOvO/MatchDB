var express = require('express');
var router = express.Router();
const mdb = require('../matchDB/modules/dbOperator');
const contextCheck = require('../matchDB/modules/contextCheck')

/* GET users listing. */
router.post('/', (req, res, next)=>{
    console.log("POST:")
    console.log(req.body);
    const context = req.body;
    // Check Context
    const checkResult = contextCheck('deleteWhere',context)
    if (!checkResult.result){
        res.status(400)
        return res.send({
            status:461,
            msg:checkResult.msg
        })
    }
    // Operation
    updateWhere(context).then(()=>console.log('An updateWhere request has been handled'))

    // Function
    async function updateWhere(context) {
        try{
            const rootConfig = await mdb.readRootConfig()
            if (!(rootConfig.database.includes(context.db))){
                throw new Error('434')
            }
            const dbConfig = await mdb.readDatabaseConfig(context.db)
            if (!(dbConfig.table.includes(context.table))){
                throw new Error('435')
            }
            const updateArr = mdb.updateWhere(context)
            return res.send(
                updateArr
            )
        }catch(e){
            console.log(e.message)
            switch (e.message){
                case "434":
                    res.status(400)
                    return res.send({
                        status:434,
                        msg:`[MatchDB]:database ${context.db} is not existed`
                    })
                    break;
                case "435":
                    res.status(400)
                    return res.send({
                        status:435,
                        msg:`[MatchDB]:table ${context.table} is not existed`
                    })
                    break;
            }
            res.status(400)
            return res.send({
                status:462,
                msg:`fail to delete data---${e.message}`
            })
        }
    }
});

module.exports = router;