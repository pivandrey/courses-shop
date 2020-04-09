const { Router } = require('express');
const Course = require('../models/course');
const router = Router();

function mapCartItems(cart) {
    return cart.items.map(c => ({
        ...c.courseId._doc,
        id: c.courseId._id,
        count: c.count
    }))
}

function computePrice(courses) {
    return courses.reduce((acc, c) => {
        return acc + c.price * c.count;
    }, 0)
}

async function getCoursesFromUser(user) {
    const userWithCourses = await user
        .populate('cart.items.courseId')
        .execPopulate();

    return mapCartItems(userWithCourses.cart);
}

router.post('/add', async (req, res) => {
    const course = await Course.findById(req.body.id);
    await req.user.addToCart(course);
    res.redirect('/card');
})

router.delete('/remove/:id', async (req, res) => {
    await req.user.removeFromCart(req.params.id);
    const courses = await getCoursesFromUser(req.user);
    const cart = {
        courses,
        price: computePrice(courses)
    };

    res.status(200).json(cart);
})

router.get('/', async (req, res) => {
    const courses = await getCoursesFromUser(req.user);

    res.render('card', {
        isCard: true,
        title: 'Корзина',
        courses: courses,
        price: computePrice(courses)
    })
})

module.exports = router;