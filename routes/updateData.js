var express = require('express');
var router = express.Router();
const mdb = require('../matchDB/modules/methods');

/* GET users listing. */
router.post('/', function(req, res, next) {
    console.log("POST:")
    console.log(req.body);
    const context = req.body;
    // Check Context
    const checkResult = mdb.contextCheck('updateData',context)
    if (!checkResult.result){
        res.status(400)
        return res.send({
            status:431,
            msg:checkResult.msg
        })
    }
    // Operation
    updateData(context).then(()=>console.log('An updateData request has been handled'))

    // Function
    async function updateData(context) {
        try{
            const rootConfig = await mdb.readRootConfig()
            if (!(rootConfig.database.includes(context.db))){
                throw new Error('434')
            }
            const dbConfig = await mdb.readDatabaseConfig(context.db)
            if (!(dbConfig.table.includes(context.table))){
                throw new Error('435')
            }
            const updateArr = mdb.updateData(context)
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
                status:452,
                msg:`fail delete an data---${e.message}`
            })
        }
    }
});



module.exports = router;