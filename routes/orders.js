const { Router } = require('express')
const Order = require('../models/order');
const auth = require('../middleware/auth');
const router = Router();

router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find({ 'user.userId': req.user._id })
            .populate('user.userId');

        res.render('orders', {
            isOrder: true,
            title: 'Заказы',
            orders: orders.map(o => ({
                ...o._doc,
                price: o.courses.reduce((acc, c) => {
                    return acc + c.course.price * c.count;
                }, 0)
            }))
        })
    } catch (e) {
        console.log(e);
    }
})

router.post('/', auth, async (req, res) => {
    try {

        const user = await req.user
            .populate('cart.items.courseId')
            .execPopulate();

        const courses = user.cart.items.map(c => ({
            course: { ...c.courseId._doc },
            count: c.count
        }))

        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user
            },
            courses
        })

        await order.save();
        await req.user.clearCart();

        res.redirect('/orders');
    } catch (e) {
        console.log(e);
    }

})

module.exports = router;