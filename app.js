const express = require("express");
const { connection } = require("./config");
const UserModel = require("./models/User.model");
const Usersignmodel=require("./models/Usersign.model")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  let { email, password, age } = req.body;
  await bcrypt.hash(password, 8, function (err, hash) {
    if (err) {
      return res.send("Signup Faild please try again");
    }
    const user = new Usersignmodel({ email, password: hash, age });
    user.save(); // Creating new user and saving it into database
    return res.send("Signup successfull");
  });
});

app.post("/login", async (req, res) => {
  let { email, password } = req.body;
  const user = await Usersignmodel.findOne({ email });
  if (!user) {
    return res.send("Invalid Credentials. Please try again");
  }
  const hashed_password = user.password;
  await bcrypt.compare(password, hashed_password, function (err, result) {
    if (err) {
      return res.send("Please Try Again later");
    }
    if (result) {
      const token = jwt.sign(
        { email: user.email, age: user.age, _id: user._id },
        "secret"
      );
      return res.send({ message: "Login successfull", token: token });
    } else {
      return res.send("Invalid Credentials. Please try again");
    }
  });
});
app.get("/notes/:id", async (req, res) => {
  const id = req.params.id;
 const {token} = req.query
console.log(token,"user")
  jwt.verify(token, "secret", function (err, decoded) {
    if (err) {
      return res.send("Login Again");
    }
  });

  try {
    const user = await UserModel.find({ id: id });
    return res.send(user);
  } catch {
    return res.send("not found");
  }

    // const user = await UserModel.find({ _id: id });
    // return res.send(user);
  
});

app.patch("/notes/:id", async (req, res) => {
  const id = req.params.id;
  const TodoBody = req.body;
  const {token} = req.query

  jwt.verify(token, "secret", (err, decoded) => {
    if (err) {
      return res.send("Error in token Verification");
    }
  });

  try {
    const todo = await UserModel.updateOne({ _id: id }, TodoBody);
    return res.send({ status: "todo Patched", todo: todo });
  } catch {
    return res.send("Error in Patching");
  }
});

app.delete("/notes/:id", async (req, res) => {
  const id = req.params.id;
  const {token} = req.query

  jwt.verify(token, "secret", (err, decoded) => {
    if (err) {
      return res.send("Error in Delete token Verification");
    }
  });

  try {
    const todo = await UserModel.deleteOne({ _id: id });
    return res.send({ status: "todo Deleted", todo: todo });
  } catch {
    return res.send("Error in Delete");
  }
});


const validation = (req, res, next) => {
  const { title,note,label } = req.body;
  
  if (title.length!==0 && note.length!==0 && label.length!==0
  ) {
    next();
  } else {
    res.send("credentials are not complete");
  }
};
app.use(validation);
app.post("/notes/:id", async (req, res) => {
  const { title,note,label } = req.body;
const id=req.params.id
  const token = jwt.sign({ title: title, note:note,label:label }, "secret", {
    expiresIn: "1h",
  });

  const todos = new UserModel({
    id,
    title,
   note,
   label
  });
  await todos.save();

  return res.send({ message: "Notes Saved successfully", token: token });
});




app.listen(8080, async () => {
  try {
    await connection;
    console.log("Connected to Server");
  } catch {
    console.log("connection error");
  }
  console.log("Server running at http://localhost:8080");
});
