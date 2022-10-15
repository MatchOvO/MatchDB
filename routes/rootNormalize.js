var express = require('express');
var router = express.Router();
const mdb = require('../matchDB/modules/dbOperator');
const fs = require('fs/promises')

/* GET users listing. */
router.post('/', function(req, res, next) {
    console.log(req.body);
    const context = req.body;
    // operation
    rootNormalize(context).catch(e=>{
        return res.send({
            status:402,
            msg:`fail to normalize MatchDB's root---${e.message}`
        })
    });


    //function
    async function rootNormalize(context) {
        await  fs.rm(`./matchDB/matchDB_root/`,{force:true,recursive:true})
        await fs.mkdir(`./matchDB/matchDB_root/`)
        const rootConfig = mdb.rootConfigNormalize(context)
        await  fs.writeFile(`./matchDB/matchDB_root/root_cnf.json`,rootConfig)
        return res.send({
            status:200,
            msg:`normalize MatchDB's root`
        })
    }

});


module.exports = router;