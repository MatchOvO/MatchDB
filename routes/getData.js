var express = require('express');
var router = express.Router();
const mdb = require('../matchDB/modules/methods');

/* GET users listing. */
router.get('/', getDataHandler);
router.post('/', getDataHandler);

function getDataHandler(req,res,next){
    console.log("POST/GET:")
    console.log(req.body);
    const context = (Object.keys(req.query).length !== 0) ? req.query : req.body;
    // Check Context
    const checkResult = mdb.contextCheck('getData',context)
    if (!checkResult.result){
        res.status(400)
        return res.send({
            status:451,
            msg:checkResult.msg
        })
    }
    // Operation
    getData(context).then(()=>console.log('An getData request has been handled'))

    // Function
    async function getData(context) {
        try{
            const rootConfig = await mdb.readRootConfig()
            if (!(rootConfig.database.includes(context.db))){
                throw new Error('434')
            }
            const dbConfig = await mdb.readDatabaseConfig(context.db)
            if (!(dbConfig.table.includes(context.table))){
                throw new Error('435')
            }
            const dataArr = mdb.getData(context)
            return res.send(
                dataArr
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
                msg:`fail to get an data---${e.message}`
            })
        }
    }
}




module.exports = router;