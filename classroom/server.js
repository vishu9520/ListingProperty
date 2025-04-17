const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");

const app = express();
app.use(session(sessionOptions));
app.use(flash());
app.use(
    session({
        secret: "mysupersecretstring"
    })
);

app.get("/test", (req, res) => {
    res.send("test successful!");
});

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
