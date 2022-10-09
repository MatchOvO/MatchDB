var express = require('express');
var router = express.Router();
const mdb = require('../matchDB/modules/methods');

/* GET users listing. */
router.post('/', function(req, res, next) {
    console.log("POST:")
    console.log(req.body);
    const context = req.body;
    // Check Context
    const checkResult = mdb.contextCheck('addData',context)
    if (!checkResult.result){
        return res.send({
            status:421,
            msg:checkResult.msg
        })
    }
    // Operation
    addData(context).then(()=>console.log('An addData request has been handled'))

    // Function
    async function addData(context) {
        try{
            await mdb.addData(context)
            return res.send({
                status:200,
                msg:`added an data in ${context.form}`
            })
        }catch(e){
            console.log(e.message)
            switch (e.message){
                case "Error: 423":
                    return res.send({
                        status:423,
                        msg:'fail to create form--- _id has been used'
                    })
                    break;
            }
            return res.send({
                status:422,
                msg:`fail to create form---${e.message}`
            })
        }
    }

});


module.exports = router;