module.exports = {
    MONGODB_URI: process.env.MONGODB_URI,
    PORT: process.env.PORT || 3000,
    SESSION_SECRET: process.env.SESSION_SECRET,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    BASE_URL: process.env.BASE_URL
}