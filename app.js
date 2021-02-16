const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const OrderList = require('./models/order');
const methodOverride = require('method-override')

const app = express();
const dbURI = 'mongodb+srv://SeongEon:sugeoboss@cluster0.l9pdy.mongodb.net/SugeoBoss?retryWrites=true&w=majority';
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));


app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(methodOverride('_method'));

app.post('/create-order', (req, res) => {
    const order = new OrderList(req.body);
    order.save()
        .then((result) => {
            res.redirect('/');
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/orderlists', (req, res) => {
    if ('datefrom' in req.query) {
        var datefrom = new Date(req.query.datefrom);
        var dateto = new Date(req.query.dateto);

        OrderList.find({
            username: req.query.username,
            phone: req.query.phone,
            createdAt: {
                "$gte" : datefrom,
                "$lte" : dateto
            }
        })
        .then((result) => {
            res.render('orderlists', {orders: result});
        })
        .catch((err) => {
            console.log(err)
        })

    
    } else {
        OrderList.find({username : req.query.username, phone : req.query.phone}).sort({createdAt: -1})
        .then((result) => {
            res.render('orderlists', {orders: result});
        })
        .catch((err) => {
            console.log(err)
        });
    }
});

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/check-order', (req, res) => {
    res.render('check-order', {deleted : false})
});

app.delete('/orderlists/:id', (req, res) => {
    const id = req.params.id;

    OrderList.findByIdAndDelete(id)
        .then(result => {
            res.render('check-order', {message : '취소가 완료되었습니다. 신청내역을 다시 확인하세요.', deleted : true});
        })
        .catch((err) => {
            console.log(err)
        });
});

app.get('/check-order-bydate', (req, res) =>  {
    res.render('check-order-bydate');
}) 