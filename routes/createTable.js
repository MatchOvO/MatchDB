var express = require('express');
var router = express.Router();
const mdb = require('../matchDB/modules/dbOperator');
const fs = require('fs/promises')
const contextCheck = require('../matchDB/modules/contextCheck')

/* GET users listing. */
router.post('/', function(req, res, next) {
    console.log(req.body);
    const context = req.body;
    // check context
    const checkResult = contextCheck('createTable',context)
    if (!checkResult.result){
        res.status(400)
        return res.send({
            status:421,
            msg:checkResult.msg
        })
    }
    // operation
    createTable(context).then(()=>console.log('An createTable request has been handle'))

    // function
    async function createTable(context) {
        try{
            await mdb.createTable(context)
            return res.send({
                status:200,
                msg:`creat table: ${context.tableName}`
            })
        }catch(e){
            switch (e.message){
                case "423":
                    res.status(400)
                    return res.send({
                        status:423,
                        msg:`[MatchDB]:fail to create an table--- table ${context.tableName} has been exited`
                    })
                    break;
            }
            res.status(500)
            return res.send({
                status:500,
                msg:`fail to create table---${e}`
            })
        }
    }

});


module.exports = router;