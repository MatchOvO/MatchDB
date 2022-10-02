var express = require('express');
var router = express.Router();
const mdb = require('../matchDB/modules/methods');
const fs = require('fs/promises')

/* GET users listing. */
router.post('/', function(req, res, next) {
    console.log(req.body);
    const context = req.body;
    // check context
    const checkResult = mdb.contextCheck('createForm',context)
    if (!checkResult.result){
        return res.send({
            status:421,
            msg:checkResult.msg
        })
    }
    // operation
    createForm(context).then(()=>console.log('An form created'))

    // function
    async function createForm(context) {
        try{
            await mdb.createForm(context)
            return res.send({
                status:200,
                msg:`creat form: ${context.formName}`
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