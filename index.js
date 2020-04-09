const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');

const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');
const cardRoutes = require('./routes/card');
const ordersRoutes = require('./routes/orders');

const User = require('./models/user');

const app = express();

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(async (req, res, next) => {
    try {
        const user = await User.findById('5e8ddd77f4246476f0b69ee6');
        req.user = user;
        next();
    } catch (e) {
        console.log(e);
    }
})

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);

const PORT = process.env.PORT || 3000;


async function start() {
    try {
        const password = 'BiYD7SnZUCpfuaKU';
        const url = `mongodb+srv://admin:${password}@cluster0-vmmod.mongodb.net/shop`

        await mongoose.connect(url, {
            useNewUrlParser: true,
            useFindAndModify: false
        });
        const candidate = await User.findOne();
        if (!candidate) {
            const user = new User({
                email: 'ivanov@mail.ru',
                name: 'Andrey',
                cart: { items: [] }
            })
            await user.save();
        }
        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`)
        });
    } catch (err) {
        console.log(err)
    }
}

start();