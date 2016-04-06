var express = require('express');
var app = express();
var path = require('path');
var log = require('./libs/log')(module);
var RecordModel = require('./libs/mongoose').RecordModel;
var logger = require('morgan');

var config = require('./libs/config');

app.listen(config.get('port'), function(){
    log.info('Express server listening on port ' + config.get('port'));
});

app.use(logger('dev')); // выводим все запросы со статусами в консоль
//app.use(app.router); // модуль для простого задания обработчиков путей
app.use(express.static(path.join(__dirname, "public"))); // запуск статического файлового сервера, который смотрит на папку public/ (в нашем случае отдает index.html)

app.use(function(req, res, next){
    res.status(404);
    log.debug('Not found URL: %s',req.url);
    res.send({ error: 'Not found' });
    return;
});

app.use(function(err, req, res, next){
    res.status(err.status || 500);
    log.error('Internal error(%d): %s',res.statusCode,err.message);
    res.send({ error: err.message });
    return;
});

app.get('/ErrorExample', function(req, res, next){
    next(new Error('Random error!'));
});

app.get('/api/records/:id', function(req, res) {
    return RecordModel.findById(req.params.id, function (err, record) {
        if(!record) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        if (!err) {
            return res.send({ status: 'OK', record:record });
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    });
});

app.get('/api', function (req, res) {
    res.send('API is running');
});

// app.listen(3000, function(){
// 	console.log('Express server listening on port 3000');
// });