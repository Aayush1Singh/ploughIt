import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const salt = 10;
const jwtSecret = "tusharisgay";
const app = express();

app.use(express.json());
const corsOption = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corsOption));
import mysql from "mysql";
import { skipPartiallyEmittedExpressions } from "typescript";

// configurations for creating mysql connection
const con = mysql.createConnection({
  host: "localhost", // host for connection
  port: 3306, // default port for mysql is 3306
  database: "ploughIt", // database from which we want to connect our node application
  user: "root", // username of the mysql connection
  password: "aayush", // password of the mysql connection
});
// executing connection
con.connect(function (err) {
  if (err) {
    console.log("error occurred while connecting");
  } else {
    console.log("connection created with mysql successfully");
  }
});

app.get("/demand/insert", (req, res) => {
  const data = req.headers;
  console.log(data);
  const result = con.query(
    `insert into demand(crop,variety,quantity,price,duration,preference,description,contractorID) values("${data.crop}","${data.variety}",${data.quantity},${data.price},${data.duration},"${data.preference}","${data.description}","${data.id}");`
  );
  console.log("added");
  res.send("inserted");
});

app.get("/demand/search", (req, res) => {
  const { crop, variety, price, quantity, preference, duration, PAGE_SIZE } =
    JSON.parse(req.headers.data);
  console.log(JSON.parse(req.headers.data));
  console.log("helooooooooooooooooooooooooooooooooooooooooooooooooo");
  con.query(
    `select * from demand where quantity between ${quantity[0]} and ${
      quantity[1]
    } and duration between ${duration[0]} and ${duration[1]} ${
      preference === "" ? "" : `and preference like "${preference}"`
    } and price>=${price} ${
      crop.length > 0 ? `and crop in ("${crop.join(`","`)}")` : ""
    } ${
      variety.length > 0 ? `and variety in ("${variety.join(`","`)}")` : ""
    } order by auto_id limit ${PAGE_SIZE + 1}`,
    (err, result, fields) => {
      console.log(result);
      let hasMore = true;
      if (result.length != PAGE_SIZE + 1) hasMore = false;
      if (result.length == PAGE_SIZE + 1) result.pop();
      res.send({
        result,
        cursors: {
          next: result.length === 0 ? -1 : result[result.length - 1].auto_id,
          prev: result.length === 0 ? -1 : result[0].auto_id,
          hasMore,
        },
        auto_id: result.length === 0 ? -1 : result[result.length - 1].auto_id,
      });
    }
  );
  // console.log(result);
  // res.send("x");
});
app.get("/demand/search/id", (req, res) => {
  con.query(
    `select * from demand where auto_id=${JSON.parse(req.headers.data).id}`,
    (err, result) => {
      res.send(result);
    }
  );
});
app.get("/demand/search/prev", (req, res) => {
  const {
    crop,
    variety,
    price,
    quantity,
    preference,
    duration,
    PAGE_SIZE,
    cursors,
  } = JSON.parse(req.headers.data);
  con.query(
    `select * from demand where quantity between ${quantity[0]} and ${
      quantity[1]
    } and duration between ${duration[0]} and ${duration[1]}${
      preference === "" ? "" : `and preference like "${preference}"`
    } and price>=${price} ${
      crop.length > 0 ? `and crop in ("${crop.join(`","`)}")` : ""
    } ${
      variety.length > 0 ? `and variety in ("${variety.join(`","`)}")` : ""
    } and auto_id<${cursors.prev} order by auto_id desc limit ${
      PAGE_SIZE + 1
    };`,
    (err, result, fields) => {
      console.log(result);
      result.reverse();
      let hasMore = true;
      if (result.length != PAGE_SIZE + 1) hasMore = false;
      if (result.length == PAGE_SIZE + 1) result.pop();
      res.send({
        result,
        cursors: {
          next: result.length === 0 ? -1 : result[result.length - 1].auto_id,
          prev: result.length === 0 ? -1 : result[0].auto_id,
          hasMore: true,
        },
        auto_id: result.length === 0 ? -1 : result[0].auto_id,
      });
    }
  );
});

app.get("/demand/search/next", (req, res) => {
  const {
    crop,
    variety,
    price,
    quantity,
    preference,
    duration,
    PAGE_SIZE,
    cursors,
  } = JSON.parse(req.headers.data);
  console.log("hello");
  console.log(
    `select * from demand where quantity between ${quantity[0]} and ${
      quantity[1]
    } and duration between ${duration[0]} and ${duration[1]} ${
      preference === "" ? "" : `and preference like "${preference}"`
    } and price>=${price} ${
      crop.length > 0 ? `and crop in ("${crop.join(`","`)}")` : ""
    } ${
      variety.length > 0 ? `and variety in ("${variety.join(`","`)}")` : ""
    } and auto_id>${cursors.next} order by auto_id limit ${PAGE_SIZE}`
  );
  con.query(
    `select * from demand where quantity between ${quantity[0]} and ${
      quantity[1]
    } and duration between ${duration[0]} and ${duration[1]} ${
      preference === "" ? "" : `and preference like "${preference}"`
    } and price>=${price} ${
      crop.length > 0 ? `and crop in ("${crop.join(`","`)}")` : ""
    } ${
      variety.length > 0 ? `and variety in ("${variety.join(`","`)}")` : ""
    } and auto_id>${cursors.next} order by auto_id limit ${PAGE_SIZE + 1};`,
    (err, result) => {
      if (err) console.log(err);
      console.log(result, "lll");
      let hasMore = true;
      if (result.length != PAGE_SIZE + 1) hasMore = false;
      if (result.length == PAGE_SIZE + 1) result.pop();

      res.send({
        result,
        cursors: {
          next: result.length === 0 ? -1 : result[result.length - 1].auto_id,
          prev: result.length === 0 ? -1 : result[0].auto_id,
          hasMore,
        },
        auto_id: result.length === 0 ? -1 : result[0].auto_id,
      });
    }
  );
});
/*{
  "success": true,
  "message": "User details retrieved successfully.",
  "data": {
    "id": 1,
    "name": "Aayush Singh",
    "email": "aayush3708@gmail.com",
    "phone": "8076442909"
  },
  "errors": [],
  "metadata": {
    "timestamp": "2025-01-06T10:10:00Z"
  }
} */
app.post("/signup/contractor", (req, res) => {
  console.log(req.body.data);
  const { result } = con.query(
    `select * from contractor where email="${req.body.email}";`,
    (err, result) => {
      if (result?.length > 0) {
        console.log("hello");
        res.status(400).send({ error: "email not registered" });
      }

      bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
        if (err) throw new Error(err.message);

        con.query(
          `insert into contractor(contractor_name,email,password) values("${req.body.contractor_name}","${req.body.email}","${hash}")`
        );

        res.send("ok");
      });
    }
  );
  console.log(`select * from contractor where email="${req.body.email}";`);
  // console.log(result);
});
app.post("/signup/farmer", (req, res) => {
  console.log(req.body.data);
  const { result } = con.query(
    `select * from farmer where email="${req.body.email}";`,
    (err, result) => {
      if (result?.length > 0) {
        console.log("hello");
        res.status(400).send({ error: "email not registered" });
      }

      bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
        if (err) throw new Error(err.message);

        con.query(
          `insert into farmer(email,password) values("${req.body.email}","${hash}")`
        );

        res.send("ok");
      });
    }
  );
  console.log(`select * from farmer where email="${req.body.email}";`);
  // console.log(result);
});
app.get("/signin", (req, res) => {
  // console.log(req.headers);
  const a = async function () {
    console.log(
      `select * from ${req.headers.password} where email="${req.headers.email}"`
    );
    const { result } = await con.query(
      `select * from ${req.headers.role} where email="${req.headers.email}"`,
      async function (err, result) {
        // console.log(result);
        if (result.length == 0) {
          res.status(401).send("username/email invalid");
          return;
        }
        console.log(result[0]);
        await bcrypt.compare(
          req.headers.password,
          result[0].password,
          (error, isMatch) => {
            console.log(isMatch);
            if (isMatch) {
              const accessToken = jwt.sign(
                JSON.stringify({
                  email: req.headers.email,
                  role: req.headers.role,
                  id:
                    req.headers.role === "farmer"
                      ? result[0].farmerID
                      : result[0].contractorID,
                }),
                jwtSecret
              );
              console.log(
                "lololo",
                req.headers.role === "farmer"
                  ? result[0].farmerID
                  : result[0].contractorID
              );
              res.send({
                accessToken,
                id:
                  req.headers.role === "farmer"
                    ? result[0].farmerID
                    : result[0].contractorID,
              });
              return;
            } else {
              console.log(error);
              res.status(401).send("username/email invalid");
              return;
              // throw new Error("email or password is incorrect");
            }
          }
        );
      }
    );
  };
  a();
});
app.get("/details", (req, res) => {
  const { id } = req.headers;
  console.log(id);
  try {
    con.query(`select * from demand where auto_id=${id};`, (error, result) => {
      console.log(`select * from demand where auto_id=${id};`, result, error);
      res.send(result);
    });
  } catch {}
});
app.get("/contractor/demand", (req, res) => {
  console.log(req.headers, "helllllllllllllllllll");
  const { data } = req.headers;
  console.log(data);
  const x = JSON.parse(data);
  console.log(x);
  const id = x.id;
  // res.send("id");
  // if (!id) {
  //   console.log(id);
  //   res.send("no id passed");
  //   return;
  // }
  con.query(
    `select * from demand where contractorID=${id}`,
    (error, result) => {
      if (error) console.log(error);
      res.status(200).send(result);
      return;
    }
  );
});
app.get("/signin/verify", (req, res) => {
  console.log(req.headers);
  const { token } = req.headers;
  // console.log(token, !token);
  if (!token) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    // console.log(decoded);
    // console.log();
    res.send(decoded);
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Invalid token" });
  }
});
app.get("/update", (req, res) => {
  console.log(req);
  const data = JSON.parse(req.headers.data);
  console.log("hello");
  delete data["created_at"];
  console.log(
    `replace into demand(${Object.entries(data)
      .map((entries) => JSON.stringify(entries[0]))
      .join(",")}) values(${Object.entries(data)
      .map((entries) => JSON.stringify(entries[1]))
      .join(",")})`
  );
  con.query(
    `replace into demand(${Object.entries(data)
      .map((entries) => entries[0])
      .join(",")}) values(${Object.entries(data)
      .map((entries) => JSON.stringify(entries[1]))
      .join(",")})`,
    (err, result) => {
      console.log(err);
      if (err) {
        res.status(500).send("yello");
        console.log(err);
      } else res.status(200).send("sab chenga si");
    }
  );
});
app.get("/proposal/insert", (req, res) => {
  const data = JSON.parse(req.headers.data);
  con.query(
    `insert into proposal(${Object.entries(data)
      .map((object) => object[0])
      .join(",")}) values(${Object.entries(data).map((object) =>
      JSON.stringify(object[1])
    )})`
  );
  res.send("ok");
});
app.get("/proposal/search", (req, res) => {
  con.query(
    `select * from proposal where contractorID=${req.headers.id};`,
    (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(
        result,
        "kkkookokookkookkookokokookokokokokokkookokkookokkokookokokkookkookokkokookokokokkookokkokkokokookkookook"
      );
      res.send(result);
      return;
    }
  );
});
app.listen(3000, (err) => {
  console.log("hello");
});

/*
{
"crop":  "wheat",
"description": "this is test file",
"duration": "4",
"ownerID": "efgh",
"preference": "none",
"price": "120",
"quantity": "75",
"variety": "mogra"
} 
*/
/*
{
  "quantity":[0,200],
  "duration":[0,12],
  "preference":"none",
  "price":0,
  "crop":["wheat","rice"],
  "variety":["mogra"],
  "PAGE_SIZE":2,
  "auto_id":2

}
*/
/*
{
    "contractor_name":"aayush",
    "email":"abc@gmail.com",
    "password":"helloitsme"
} 
*/
