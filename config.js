
config = {
    MONGO_HOST : process.env.MONGO_HOST || "127.0.0.1",
    MONGO_DB   : process.env.MONGO_DB   || "test",

    SMTP_HOST : process.env.SMTP_HOST || "127.0.0.1",
    SMTP_USER : process.env.SMTP_USER || "nullmailer",
    SMTP_PASS : process.env.SMTP_PASS || "nullmailer",
    SMTP_FROM : process.env.SMTP_FROM || "noreply@hologramusa.com",

    BASE_URL  : process.env.BASE_URL || "",
};


module.exports = config;
