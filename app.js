const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const blogModal = require("./models/blogs");
const Users = require("./models/users");
const jwt = require("jsonwebtoken");
const { requireAuth } = require("./middlewares/routeProtection");
var cors = require("cors");

const app = express();

// ConnectingToDatabase
const connectDB =
  "mongodb+srv://subhan777x:Test123@nodecluster.zaxk9ze.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(connectDB)
  .then(() => {
    console.log("Connected to Database");
    app.listen(8000);
  })
  .catch((err) => console.log("err---Connecting to data base failed", err));

//MiddleWares
app.use(morgan("dev"));
app.use(cors({ origin: "http://localhost:3001" }));
app.use(express.json());

const maxAge = 3 * 24 * 60 * 60;
//CreateJWTToken
const createToken = (id) => {
  return jwt.sign({ id }, "dummyProj", {
    expiresIn: maxAge,
  });
};

app.get("/about", (req, res) => {
  res.sendFile("./ABOUT.html", { root: __dirname });
});

//AddStaticBlog
app.get("/create-blog", (req, res) => {
  const blog = new blogModal({
    title: "First blog",
    body: "This is the first ever blog created",
  });
  blog
    .save()
    .then((result) => {
      res.send(`Blog Created in data base 2 ${result}`);
    })
    .catch((err) => {
      res.send(`Blog Created in data base ${err}`);
    });
});

//GetAllBlogs
app.get("/get-blogs", (req, res) => {
  blogModal
    .find()
    .then((result) => {
      res.status(200);
      res.json(result);
    })
    .catch((err) => {
      res.send(`Failed to fetch blogs ${err}`);
    });
});

//CreateDynamicBlog
app.post("/create-blog", (req, res) => {
  const newBlog = new blogModal({
    title: req.body.title,
    body: req.body.body,
  });
  newBlog
    .save()
    .then((result) => {
      // res.send(result);
      blogModal.find().then((result) => {
        res.status(200);
        res.json(result);
      });
    })
    .catch((err) => {
      res.send(`Failed to fetch blogs ${err}`);
    });
});

//SearchbyId
app.get("/get-blog/:id", (req, res) => {
  const id = req.params.id;
  blogModal
    .findById(id.toString())
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send("Failed");
    });
});

//DeletebyId
app.get("/delete-blog/:id", (req, res) => {
  const id = req.params.id;
  blogModal
    .findByIdAndDelete(id.toString())
    .then(() => {
      blogModal.find().then((result) => {
        res.status(200);
        res.json(result);
      });
    })
    .catch((err) => {
      res.send("Failed");
    });
});

//UserSignup
app.post("/user-signup", (req, res) => {
  const { email, password } = req.body;
  console.log("ress", req.body)
  Users.create({
    email,
    password,
  })
    .then((result) => {
      res.status(201);
      const token = createToken(result._id);
      res.send({
        accessToken: token,
      });
    })
    .catch((err) => {
      console.log("err", err.message);
      res.status(400);
      res.send(`Signup Failed ${err}`);
    });
});

//UserLogin
app.post("/user-login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Users.login(email, password);
    const token = createToken(user._id);
    const data = {
      email,
      password,
      token,
    };
    res.status(200);
    res.send(data);
  } catch (error) {
    console.log("error", error);
    res.status(400);
    res.send(`Login failed ${error.message}`);
  }
});
