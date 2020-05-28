//路由文件中，要有四个步骤
//1.加载express
//2.创建路由对象
//3.把接口挂载在路由对象上
//4.导出路由对象
const path = require('path');
const express = require('express');
const router = express.Router();
const db = require(path.join(__dirname, '../utils/db.js'));
const utility = require('utility');
const jsonwebtoken = require('jsonwebtoken');

//------------这里写接口----------
//用户注册接口
router.post('/reguser', async(req, res) => {
    //   console.log(req.body);//req.body用于接收用户名密码
    //md5用于加密密码
    req.body.password = utility.md5(req.body.password)

    let r = await db('insert into user set ?', req.body);


    if (r && r.affectedRows > 0) {
        res.send({ status: 0, message: '注册成功' })
    } else {
        res.send({ status: 1, message: '注册失败' })
    }

});

//用户登录接口
router.post('/login', async(req, res) => {
    let arr = [
        utility.md5(req.body.password),
        req.body.username
    ];
    let r = await db('select * from user where password=? and username=?', arr);
    if (r && r.length > 0) {
        res.send({
            status: 0,
            message: '登录成功',
            // token: 'Bearer ' + jsonwebtoken.sign('数据', '用于加密的字符串', 配置项)
            // 'Bearer ' 必须加一个空格，和token字符串分开
            token: 'Bearer ' + jsonwebtoken.sign({ username: req.body.username, id: r[0].id },
                'bigevent', { expiresIn: '2 days' }
            )
        });
    } else {
        res.send({ status: 1, message: '登录失败' })
    }
})



module.exports = router;