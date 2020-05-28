const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const expressJWt = require('express-jwt');

app.listen(3307, () => {
    console.log('server start~');

});

//------配置应用级别的中间件--------
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(expressJWt({ secret: 'bigevent' }).unless({ path: /^\/api/ }));

//-------加载路由模块-------
app.use('/api', require(path.join(__dirname, 'routers', 'login')));
app.use('/my/article', require(path.join(__dirname, 'routers', 'category')));
app.use('/my/article', require(path.join(__dirname, 'routers', 'article')));
app.use('/my', require(path.join(__dirname, 'routers', 'user')));


//配置处理错误的中间件
app.use(function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send({ status: 1, message: '身份认证失败' });
    }
});