//路由文件中，要有四个步骤
//1.加载express
//2.创建路由对象
//3.把接口挂载在路由对象上
//4.导出路由对象
const path = require('path');
const db = require(path.join(__dirname, '../utils/db.js'));
const utility = require('utility');
const express = require('express');
const router = express.Router();

//------------这里写接口----------


//获取用户个人信息
router.get('/userinfo', async(req, res) => {
    let r = await db('select id,username,nickname,email from user where id=?', req.user.id);
    if (r && r.length > 0) {
        res.send({ status: 0, message: '获取用户个人信息成功', data: r[0] })
    } else {
        res.send({ status: 1, message: '获取用户个人信息失败' })
    }

})

//更新用户个人信息
router.post('/userinfo', async(req, res) => {
    // 判断一下提交的id和当前用户的id是否一致
    // console.log(req.body, req.user);
    if (req.body.id != req.user.id) {
        return res.send({ status: 1, message: 'id错误，请重新登录' })
    }
    let r = await db('update user set ? where id=?', [req.body, req.user.id]);
    if (r && r.affectedRows > 0) {
        res.send({ status: 0, message: '更新用户信息成功' })
    } else {
        res.send({ status: 1, message: '更新用户信息失败' })
    }
})


//更新用户密码
router.post('/updatepwd', async(req, res) => {
    let oldPwd = utility.md5(req.body.oldPwd);
    let newPwd = utility.md5(req.body.newPwd);
    //判断新密码和原密码是否相同
    if (oldPwd === newPwd) {
        return res.send({
            status: 1,
            message: '新密码不能和原密码相同'
        });
    }
    //判断原密码是否正确
    let r = await db('select * from user where password=? and id=?', [oldPwd, req.user.id]);
    if (r.length === 0 && r === undefined) {
        //如果查询到为r为空数组则原密码不正确
        return res.send({ status: 1, message: '原密码不正确' });
    }

    //判断完后开始更新密码
    let a = await db('update user set password=? where id=?', [newPwd, req.user.id]);
    if (a && a.affectedRows > 0) {
        res.send({ status: 0, message: '更新密码成功' })
    } else {
        res.send({ status: 1, message: '更新密码失败' })
    }
})

//更换用户头像
router.post('/update/avatar', async(req, res) => {
    let r = await db('update user set user_pic=? where id=?', [req.body.avatar, req.user.id]);
    console.log(typeof req.body.avatar);

    if (r && r.affectedRows > 0) {
        res.send({ status: 0, message: '更换头像成功' })
    } else {
        res.send({ status: 1, message: '更换头像失败' })
    }
})
module.exports = router;