var express = require('express');
var router = express.Router();
const mdb = require('../matchDB/modules/methods');
const fs = require('fs/promises')

/* GET users listing. */
router.post('/', function(req, res, next) {
    console.log(req.body);
    const context = req.body;
    // Check Context
    if (!mdb.contextCheck('addData',context).result){
        return res.send({
            status:421,
            msg:'[ERROR]: post or context format error,please use JSON to post or use the correct context format'
        })
    }
    // Operation
    addData(context).then(()=>console.log('An data has been added'))

    // Function
    async function addData(context) {
        try{
            await mdb.addData(context)
            return res.send({
                status:200,
                msg:`added an data in ${context.form}`
            })
        }catch(e){
            return res.send({
                status:422,
                msg:`fail to create form---${e}`
            })
        }
    }

});


module.exports = router;