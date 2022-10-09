var express = require('express');
var router = express.Router();
const mdb = require('../matchDB/modules/methods');

/* GET users listing. */
router.post('/', function(req, res, next) {
    console.log("POST:")
    console.log(req.body);
    const context = req.body;
    // Check Context
    const checkResult = mdb.contextCheck('getForm',context)
    if (!checkResult.result){
        return res.send({
            status:431,
            msg:checkResult.msg
        })
    }
    // Operation
    getForm(context).then(()=>console.log('An getForm request has been handled'))

    // Function
    async function getForm(context) {
        try{
            const rootConfig = await mdb.readRootConfig()
            if (!(rootConfig.database.includes(context.db))){
                return res.send({
                    status:443,
                    msg:`database ${context.db} is not existed`
                })
            }
            const dbConfig = await mdb.readDatabaseConfig(context.db)
            if (!(dbConfig.form.includes(context.form))){
                return res.send({
                    status:444,
                    msg:`form ${context.form} is not existed`
                })
            }
            const formObj = await mdb.readForm(context.db,context.form)
            return res.send({
                status:200,
                data:formObj,
                msg:`success`
            })
        }catch(e){
            console.log(e.message)
            switch (e.message){

            }
            return res.send({
                status:442,
                msg:`fail to create form---${e.message}`
            })
        }
    }

});


module.exports = router;