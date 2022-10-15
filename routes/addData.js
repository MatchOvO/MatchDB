var express = require('express');
var router = express.Router();
const mdb = require('../matchDB/modules/dbOperator');
const contextCheck = require('../matchDB/modules/contextCheck')

/* GET users listing. */
router.post('/', function(req, res, next) {
    console.log("POST:")
    console.log(req.body);
    const context = req.body;
    // Check Context
    const checkResult = contextCheck('addData',context)
    if (!checkResult.result){
        res.status(400)
        return res.send({
            status:431,
            msg:checkResult.msg
        })
    }
    // Operation
    addData(context).then(()=>console.log('An addData request has been handled'))

    // Function
    async function addData(context) {
        try{
            const rootConfig = await mdb.readRootConfig()
            if (!(rootConfig.database.includes(context.db))){
                throw new Error('434')
            }
            const dbConfig = await mdb.readDatabaseConfig(context.db)
            if (!(dbConfig.table.includes(context.table))){
                throw new Error('435')
            }
            await mdb.addData(context)
            return res.send({
                status:200,
                msg:`added an data in ${context.table}`
            })
        }catch(e){
            console.log(e.message)
            switch (e.message){
                case "433":
                    res.status(400)
                    return res.send({
                        status:433,
                        msg:'[MatchDB]:fail to add an data--- _id has been used'
                    })
                    break;
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
                status:432,
                msg:`fail add an data---${e.message}`
            })
        }
    }

});


module.exports = router;