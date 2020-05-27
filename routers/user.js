//路由文件中，要有四个步骤
//1.加载express
//2.创建路由对象
//3.把接口挂载在路由对象上
//4.导出路由对象

const express = require('express');
const router = express.Router();

//------------这里写接口----------


//获取用户个人信息
router.get('/userinfo', async(req, res) => {
    console.log(req.user);

})
module.exports = router;