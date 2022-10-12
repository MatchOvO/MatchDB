var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
  console.log(req.headers.authorization);
  const config = req.app.get('config')
  console.log(config)
  res.send('测试成功');
});

module.exports = router;
