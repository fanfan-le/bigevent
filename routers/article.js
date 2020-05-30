//路由文件中，要有四个步骤
//1.加载express
//2.创建路由对象
//3.把接口挂载在路由对象上
//4.导出路由对象

const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const multer = require('multer');
const moment = require('moment');
let upload = multer({ dest: 'uploads/' }); //设置上传目录,并生成一个对象


//--------------------发布新文章--------------\

router.post('/add', upload.single('cover_img'), async(req, res) => {
        // console.log(req.body);//获取的数据
        // console.log(req.file);//获取到的文件信息
        let obj = req.body;

        obj.cover_img = req.file.filename;
        obj.author_id = req.user.id;
        obj.pub_date = moment().format('YYYY-MM-DD HH:mm:ss');
        let r = await db('insert into article set ?', obj)
        if (r && r.affectedRows > 0) {
            res.send({ status: 0, message: '添加文章成功' })
        } else {
            res.send({ status: 1, message: '添加文章失败' })
        }


    })
    //--------------------获取文章的列表数据-------
router.get('/list', async(req, res) => {

    // 获取4个参数
    let pagenum = req.query.pagenum || 1; // 默认获取第一页的数据
    let pagesize = req.query.pagesize || 2; // 默认每页显示两条
    let cate_id = req.query.cate_id; // 分类id
    let state = req.query.state; // 状态


    // 组合where条件
    let w = '';
    if (cate_id) {
        w += ' cate_id=' + cate_id + ' and ';
    }
    if (state) {
        w += ` state='${state}' and `;
    }
    let r = await db(`select a.Id, a.title, a.pub_date, a.state, c.name cate_name from article a
    join category c on a.cate_id=c.Id
    where ${w} author_id=? limit ${(pagenum - 1) * pagesize}, ${pagesize}`, req.user.id);

    let r2 = await db('select count(*) total from article where author_id=?', req.user.id)
    if (r && r2) {
        res.send({ status: 0, message: '获取文章列表成功', data: r, total: r2[0].total })
    } else {
        res.send({ status: 1, message: '获取文章列表失败' })
    }
})

//-------------------根据Id删除文章数据--------
router.get('/delete/:id', async(req, res) => {
        let id = req.params.id;
        let r = await db('delete from article where id=?', id);
        if (r && r.affectedRows > 0) {
            res.send({ status: 0, message: '删除文章成功' })
        } else {
            res.send({ status: 1, message: '删除文章失败' })
        }
    })
    //------------------根据Id获取文章详情-------
router.get('/:id', async(req, res) => {
        let id = req.params.id;
        let r = await db('select * from article where id=?', id);
        if (r && r.length > 0) {
            res.send({
                status: 0,
                message: '获取文章成功',
                data: r[0]
            })
        } else {
            res.send({ status: 1, message: '获取文章失败' })
        }
    })
    //---------------根据Id更新文章信息---------
router.post('/edit', upload.single('cover_img'), async(req, res) => {
    let obj = req.body;

    if (req.file) {
        obj.cover_img = req.file.filename;
    }

    let r = await db('update article set ? where id=?', [obj, req.body.id]);
    if (r && r.affectedRows > 0) {
        res.send({ status: 0, message: '更新文章成功' })
    } else {
        res.send({ status: 1, message: '更新文章失败' })
    }
})

//------------这里写接口----------

module.exports = router;