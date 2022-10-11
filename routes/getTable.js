var express = require('express');
var router = express.Router();
const mdb = require('../matchDB/modules/methods');

/* GET users listing. */
router.post('/', function(req, res, next) {
    console.log("POST:")
    console.log(req.body);
    const context = req.body;
    // Check Context
    const checkResult = mdb.contextCheck('getTable',context)
    if (!checkResult.result){
        res.status(400)
        return res.send({
            status:431,
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
                res.status(400)
                return res.send({
                    status:443,
                    msg:`database ${context.db} is not existed`
                })
            }
            const dbConfig = await mdb.readDatabaseConfig(context.db)
            if (!(dbConfig.table.includes(context.table))){
                res.status(400)
                return res.send({
                    status:444,
                    msg:`table ${context.table} is not existed`
                })
            }
            const tableObj = await mdb.readTable(context.db,context.table)
            return res.send(tableObj)
        }catch(e){
            console.log(e.message)
            switch (e.message){

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