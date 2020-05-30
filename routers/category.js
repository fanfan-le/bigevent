//路由文件中，要有四个步骤
//1.加载express
//2.创建路由对象
//3.把接口挂载在路由对象上
//4.导出路由对象

const express = require('express');
const router = express.Router();
const db = require('../utils/db');

//------------这里写接口----------
//获取文章分类接口
router.get('/cates', async(req, res) => {
    let r = await db('select * from category');
    if (r) {
        res.send({ status: 0, message: '获取文章分类列表成功', data: r })
    } else {
        res.send({ status: 1, message: '获取文章分类列表失败' })
    }
});

//新增文章分类接口
router.post('/addcates', async(req, res) => {
    console.log(req.body);

    let r = await db('insert into category set ?', req.body)
    if (r && r.affectedRows > 0) {
        res.send({ status: 0, message: '新增文章分类成功！' })
    } else {
        res.send({ status: 1, message: '新增文章分类失败！' })
    }
});


//根据文章id删除文章
router.get('/deletecate/:id', async(req, res) => {
    // console.log(req.params.id);
    let r = await db('delete from category where id=?', req.params.id)
    if (r && r.affectedRows > 0) {
        res.send({ status: 0, message: '删除文章分类成功！' })
    } else {
        res.send({ status: 1, message: '删除文章分类失败' })
    }

})

//根据文章id获取文章分类
router.get('/cates/:id', async(req, res) => {
    let r = await db('select * from category where id=?', req.params.id);
    if (r) {
        res.send({ status: 0, message: '获取文章分类成功！', data: r[0] })
    } else {
        res.send({ status: 1, message: '获取文章分类失败！' })
    }
});

//根据文章id更新文章分类
router.post('/updatecate', async(req, res) => {
    let r = await db('update category set ? where id=?', [req.body, req.body.Id]);
    if (r && r.affectedRows > 0) {
        res.send({ status: 0, message: '更新分类成功' })
    } else {
        res.send({ status: 1, message: '更新分类失败' })
    }
})
module.exports = router;