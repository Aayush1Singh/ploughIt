import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mysql from "mysql";
const salt = 10;
const jwtSecret = "tusharisgay";
const corsOption = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

const app = express();
app.use(express.json());
app.use(cors(corsOption));

const con = mysql.createConnection({
  host: "localhost",
  port: 3306,
  database: "ploughIt",
  user: "root",
  password: "aayush",
});
con.connect(function (err) {
  if (err) {
    console.log("error occurred while connecting");
  } else {
    console.log("connection created with mysql successfully");
  }
});

app.get("/demand/insert", (req, res) => {
  const {
    crop,
    variety,
    quantity,
    price,
    duration,
    preference,
    description,
    id,
  } = req.headers;
  if (
    !crop ||
    !variety ||
    !quantity ||
    !price ||
    !duration ||
    !preference ||
    !id
  ) {
    res.status(400).send({
      status: "failed",
      message: "Failed to create Demand.Validation Error",
      errors: {
        crop: !crop ? "Crop cannot be empty." : undefined,
        variety: !variety ? "Variety cannot be empty." : undefined,
        quantity:
          quantity <= 0 ? "Quantity must be greater than zero." : undefined,
        price:
          price <= 0 ? "Price per unit must be greater than zero." : undefined,
        duration:
          duration <= 0 ? "Duration must be greater than zero." : undefined,
      },
    });
    return;
  }

  const result = con.query(
    `insert into demand(crop,variety,quantity,price,duration,preference,description,contractorID) values("${crop}","${variety}",${quantity},${price},${duration},"${preference}","${description}","${id}");`,
    (err, result) => {
      if (err) {
        req
          .status(505)
          .send({ status: "failed", message: "Failed to insert Demand" });
      } else
        res.status(201).send({
          status: "success",
          message: "Demand successfully inserted",
        });
      return;
    }
  );
});

app.get("/demand/search", (req, res) => {
  const { crop, variety, price, quantity, preference, duration, PAGE_SIZE } =
    JSON.parse(req.headers.data);
  if (!duration) {
    res.status(400).send({
      status: "failed",
      message: "Invalid duration sent",
    });
    return;
  }
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
    (err, result) => {
      if (err) {
        res
          .status(505)
          .send({ status: "failed", message: "Data could not be fetched" });
        return;
      }
      let hasMore = true;
      if (result.length != PAGE_SIZE + 1) hasMore = false;
      else result.pop();

      res.status(200).send({
        result,
        cursors: {
          next: result.length === 0 ? -1 : result[result.length - 1].auto_id,
          prev: result.length === 0 ? -1 : result[0].auto_id,
          hasMore,
        },
        auto_id: result.length === 0 ? -1 : result[result.length - 1].auto_id,
        status: "success",
        message: "data successfully fetched",
      });
      return;
    }
  );
});
app.get("/demand/search/id", (req, res) => {
  const { id } = JSON.parse(req.headers.data);
  if (!id) {
    res.status(400).send({
      status: "failed",
      message: "Invalid DemandID searched",
    });
    return;
  }
  con.query(`select * from demand where auto_id=${id}`, (err, result) => {
    if (err) {
      res.status(505).send({
        status: "failed",
        message: "Data could not be fetched",
      });
      return;
    } else
      res.status(200).send({
        result,
        status: "success",
        message: "data successfully fetched",
      });
    return;
  });
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
  if (!duration || !cursors?.prev) {
    res.status(400).send({
      status: "failed",
      message: "Could not find duration or cursors",
    });
    return;
  }
  con.query(
    `select * from demand where quantity between ${quantity[0]} and ${
      quantity[1]
    } and duration between ${duration[0]} and ${duration[1]}${
      preference === "" ? "" : `and preference like "${preference}"`
    } and price>=${price} ${
      crop.length > 0 ? `and crop in ("${crop.join(`","`)}")` : ""
    } ${
      variety.length > 0 ? `and variety in ("${variety.join(`","`)}")` : ""
    } and auto_id<${cursors.prev} order by auto_id desc limit ${PAGE_SIZE};`,
    (err, result) => {
      if (err) {
        res.status(505).send({
          status: "failed",
          message: "Data could not be fetched",
        });
        return;
      }
      result.reverse();
      let hasMore = true;
      res.send({
        result,
        cursors: {
          next: result.length === 0 ? -1 : result[result.length - 1].auto_id,
          prev: result.length === 0 ? -1 : result[0].auto_id,
          hasMore: true,
        },
        auto_id: result.length === 0 ? -1 : result[0].auto_id,
        status: "success",
        message: "data successfully fetched",
      });
      return;
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
  if (!quantity || !duration || !cursors?.next) {
    res.status(400).send({
      status: "failed",
      message: "Data received incorrect",
      errors: {
        quantity: !quantity ? "Quantity is not defined" : undefined,
        duration: !duration ? "Duration is not defined" : undefined,
        cursors: !cursors?.next ? "cursor is not defined" : undefined,
      },
    });
    return;
  }
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
      if (err) {
        res.status(505).send({
          status: "failed",
          message: "Data could not be fetched",
        });
        return;
      }
      let hasMore = true;
      if (result.length != PAGE_SIZE + 1) hasMore = false;
      else result.pop();

      res.send({
        result,
        cursors: {
          next: result.length === 0 ? -1 : result[result.length - 1].auto_id,
          prev: result.length === 0 ? -1 : result[0].auto_id,
          hasMore,
        },
        auto_id: result.length === 0 ? -1 : result[0].auto_id,
        status: "success",
        message: "data successfully fetched",
      });
    }
  );
});

app.post("/signup/contractor", (req, res) => {
  const { email, password, contractor_name } = req.body;
  con.query(
    `select * from contractor where email="${email}";`,
    (err, result) => {
      if (err) {
        res.status(505).send({
          status: "failed",
          message: "Data could not be verified/inserted",
        });
        return;
      }
      if (result?.length > 0) {
        res
          .status(400)
          .send({ status: "failed", message: "email registered already" });
        return;
      }

      bcrypt.hash(password.toString(), salt, (err, hash) => {
        if (err) {
          res
            .status(505)
            .send({ status: "failed", message: "User could not be created" });
          return;
        }

        con.query(
          `insert into contractor(contractor_name,email,password) values("${contractor_name}","${email}","${hash}")`,
          (err, result) => {
            if (err) {
              res.status(505).send({
                status: "failed",
                message: "User could not be created",
              });
              return;
            }

            res.status(200).send({
              status: "success",
              message: "User created",
            });
            return;
          }
        );
      });
    }
  );
});
app.post("/signup/farmer", (req, res) => {
  const { email, password } = req.body;
  const { result } = con.query(
    `select * from farmer where email="${email}";`,
    (err, result) => {
      if (result?.length > 0) {
        res
          .status(400)
          .send({ status: "failed", error: "email not registered" });
        return;
      }

      bcrypt.hash(password.toString(), salt, (err, hash) => {
        if (err) {
          res.status(505).send({
            status: "failed",
            message: "User could not be created",
          });
          return;
        }
        con.query(
          `insert into farmer(email,password) values("${email}","${hash}")`,
          (err, result) => {
            if (err) {
              res.status(505).send({
                status: "failed",
                message: "User could not be created",
              });
              return;
            }

            res.status(200).send({
              status: "success",
              message: "User created",
            });
            return;
          }
        );
      });
    }
  );
});
app.get("/signin", (req, res) => {
  // console.log(req.headers);
  const { password, email, role } = req.headers;
  if (!password || !email || !role) {
    res.status(400).send({
      status: "failed",
      message: "Something not sent",
    });
    return;
  }
  con.query(`select * from ${role} where email="${email}"`, (err, result) => {
    if (result.length == 0) {
      res
        .status(400)
        .send({ status: "failed", error: "username/email invalid" });
      return;
    }
    bcrypt.compare(
      req.headers.password,
      result[0].password,
      (error, isMatch) => {
        if (error) {
          res.status(505).send({
            status: "failed",
            message: "username/email invalid",
          });
          return;
        }

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
          res.status(200).send({
            accessToken,
            id:
              req.headers.role === "farmer"
                ? result[0].farmerID
                : result[0].contractorID,
          });
          return;
        } else {
          res
            .status(401)
            .send({ status: "failed", message: "username/email invalid" });
          return;
        }
      }
    );
  });
});
app.get("/details", (req, res) => {
  const { id } = req.headers;
  if (!id) {
    res.status(400).send({
      status: "failed",
      message: "data invalid",
    });
    return;
  }
  try {
    con.query(`select * from demand where auto_id=${id};`, (err, result) => {
      if (err) {
        res.status(505).send({
          status: "failed",
          message: "Data could not be fetched",
        });
        return;
      }
      res.status(200).send({
        result,
        status: "success",
        message: "Data successfully fetched",
      });
    });
  } catch (err) {}
});
app.get("/contractor/demand", (req, res) => {
  const { data } = req.headers;
  const { id } = JSON.parse(data);
  if (!id) {
    res.status(400).send({
      status: "failed",
      message: "data invalid",
    });
    return;
  }
  con.query(
    `select * from demand where contractorID=${id}`,
    (error, result) => {
      if (error) {
        res.status(505).send({
          status: "failed",
          message: "data could  not be fetched",
        });
        return;
      }
      res.status(200).send(result);
      return;
    }
  );
});
app.get("/signin/verify", (req, res) => {
  const { token } = req.headers;
  if (!token) {
    res.status(400).send({ error: "Invalid token" });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    res
      .status(200)
      .send({ jwt: decoded, status: "success", message: "Authenticated" });
  } catch (error) {
    res.status(400).json({ status: "failed", error: "Invalid token" });
  }
});
app.get("/update", (req, res) => {
  const data = JSON.parse(req.headers.data);
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
      if (err) {
        res.status(500).send({
          status: "failed",
          message: "Internal error",
        });
        return;
      } else
        res.status(200).send({
          status: "success",
          message: "data fetched",
        });
      return;
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
