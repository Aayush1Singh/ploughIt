import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mysql from "mysql";
import cookieParser from "cookie-parser";
import { ethers } from "ethers";
import dotenv from "dotenv";
import { createHash } from "crypto";
import axios from "axios";
// import "supabase";
// import { web3 } from "web3";
dotenv.config(); // Load Environment Variables
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PROVIDER_URL = process.env.PROVIDER_URL;
const FARMING_FACTORY_ADDRESS = process.env.FARMING_FACTORY_ADDRESS;
// Set up provider and wallet
const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
// FarmingFactory ABI (Minimal required functions)
// const FARMING_FACTORY_ABI = process.env.FARMING_FACTORY_ABI;
const FARMING_FACTORY_ABI = process.env.FARMING_FACTORY_ABI;
// console.log(
//   FARMING_FACTORY_ADDRESS,
//   "hello",
//   FARMING_FACTORY_ABI,
//   "hello",
//   wallet
// );

const farmingFactory = new ethers.Contract(
  FARMING_FACTORY_ADDRESS,
  FARMING_FACTORY_ABI,
  wallet
);

const salt = 10;
const jwtSecret = "tusharisgay";
const corsOption = {
  origin:
    "https://plough-it-4hxr-m30htylc8-aayushs-projects-977fe149.vercel.app",
  credentials: true,
  // "access-control-allow-origin": true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

const app = express();
app.use(express.json());
app.use(cors(corsOption));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const con = mysql.createConnection({
  host: "localhost",
  port: 3306,
  database: "ploughIt",
  user: "root",
  password: "aayush",
  dateStrings: true,
});
con.connect(function (err) {
  if (err) {
    console.log("error occurred while connecting");
  } else {
    console.log("connection created with mysql successfully");
  }
});
const verifyJwt = (req, res, next) => {
  const nonSecurePaths = [
    "/signin",
    "/refresh",
    "/signup/farmer",
    "/searchContract",
    "/payment",
    "/status/:txnId",
  ];
  if (nonSecurePaths.includes(req.path)) return next();
  const { token } = req.headers;
  // console.log("hello", "lololo");

  if (!token) {
    res.status(400).send({ status: "failed", message: "Invalid token" });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send({ status: "failed", message: "Expired" });
  }
};
app.use(verifyJwt);
app.get("/signin", async (req, res) => {
  // console.log("hello");
  const { password, email, role } = req.headers;
  // console.log(password, email, role);

  if (!password || !email || !role) {
    res.status(400).send({
      status: "failed",
      message: "Something not sent",
    });
    return;
  }

  const { data: result } = await supabase
    .from(`${role}`)
    .select("*")
    .eq("email", email);
  // console.log(result);
  if (result.length == 0) {
    res
      .status(400)
      .send({ status: "failed", message: "username/email invalid" });
    return;
  }
  bcrypt.compare(
    req.headers.password,
    result[0].password,
    async (error, isMatch) => {
      if (error) {
        res.status(505).send({
          status: "failed",
          message: "username/email invalid",
        });
        return;
      }

      if (isMatch) {
        const id =
          req.headers.role === "farmer"
            ? result[0].farmerID
            : result[0].contractorID;
        const accessToken = jwt.sign(
          {
            email: req.headers.email,
            role: req.headers.role,
            id:
              req.headers.role === "farmer"
                ? result[0].farmerID
                : result[0].contractorID,
          },
          jwtSecret,
          { expiresIn: 5 }
        );
        const refreshToken = jwt.sign(
          {
            email: req.headers.email,
            role: req.headers.role,
            id:
              req.headers.role === "farmer"
                ? result[0].farmerID
                : result[0].contractorID,
          },
          jwtSecret,
          { expiresIn: 1000 * 60 * 60 * 24 }
        );
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true, // Prevents client-side JavaScript from accessing it
          secure: true, // Required for HTTPS
          sameSite: "None", // Allows cross-site cookie sharing
        });
        res.status(200).send({
          accessToken,
          id:
            req.headers.role === "farmer"
              ? result[0].farmerID
              : result[0].contractorID,
        });
        // console.log("hello", result);
        var today = new Date();
        var expirationTime = new Date(today.getTime() + 24 * 60 * 60 * 1000);
        const hash = await bcrypt.hash(refreshToken, salt);
        const tempObj = {
          role: req.headers.role,
          id:
            req.headers.role === "farmer"
              ? result[0].farmerID
              : result[0].contractorID,
          expiration: expirationTime
            .toISOString()
            .slice(0, 19)
            .replace("T", " "),
          refreshToken: hash,
        };
        const { data, error } = await supabase
          .from("refreshLogin")
          .insert([tempObj])
          .select();
        // console.log(data, error);
        // con.query(
        //   `insert into refreshLogin(role,id,expiration,refreshToken) values('${
        //     req.headers.role
        //   }',${id},'${expirationTime
        //     .toISOString()
        //     .slice(0, 19)
        //     .replace("T", " ")}','${hash}');`
        // );

        return;
      } else {
        res
          .status(401)
          .send({ status: "failed", message: "username/email invalid" });
        return;
      }
    }
  );

  // con.query(`select * from ${role} where email="${email}"`, (err, result) => {
  //   if (result.length == 0) {
  //     res
  //       .status(400)
  //       .send({ status: "failed", message: "username/email invalid" });
  //     return;
  //   }
  //   bcrypt.compare(
  //     req.headers.password,
  //     result[0].password,
  //     async (error, isMatch) => {
  //       if (error) {
  //         res.status(505).send({
  //           status: "failed",
  //           message: "username/email invalid",
  //         });
  //         return;
  //       }

  //       if (isMatch) {
  //         const id =
  //           req.headers.role === "farmer"
  //             ? result[0].farmerID
  //             : result[0].contractorID;
  //         const accessToken = jwt.sign(
  //           {
  //             email: req.headers.email,
  //             role: req.headers.role,
  //             id:
  //               req.headers.role === "farmer"
  //                 ? result[0].farmerID
  //                 : result[0].contractorID,
  //           },
  //           jwtSecret,
  //           { expiresIn: 5 }
  //         );
  //         const refreshToken = jwt.sign(
  //           {
  //             email: req.headers.email,
  //             role: req.headers.role,
  //             id:
  //               req.headers.role === "farmer"
  //                 ? result[0].farmerID
  //                 : result[0].contractorID,
  //           },
  //           jwtSecret,
  //           { expiresIn: 1000 * 60 * 60 * 24 }
  //         );
  //         res.cookie("refreshToken", refreshToken);
  //         res.status(200).send({
  //           accessToken,
  //           id:
  //             req.headers.role === "farmer"
  //               ? result[0].farmerID
  //               : result[0].contractorID,
  //         });
  //         // console.log("hello");
  //         var today = new Date();
  //         var expirationTime = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  //         const hash = await bcrypt.hash(refreshToken, salt);
  //         con.query(
  //           `insert into refreshLogin(role,id,expiration,refreshToken) values('${
  //             req.headers.role
  //           }',${id},'${expirationTime
  //             .toISOString()
  //             .slice(0, 19)
  //             .replace("T", " ")}','${hash}');`
  //         );

  //         return;
  //       } else {
  //         res
  //           .status(401)
  //           .send({ status: "failed", message: "username/email invalid" });
  //         return;
  //       }
  //     }
  //   );
  // });
});
async function convertMoney(quantity, price) {
  // const data = JSON.parse(req.headers.data);
  // console.log(data);
  try {
    const convertercryptoToDollars = await axios.get(
      "https://pro-api.coinmarketcap.com/v2/tools/price-conversion",
      {
        params: {
          amount: quantity * price,
          symbol: "INR",
          convert: "ETH",
        },
        headers: {
          "X-CMC_PRO_API_KEY": "18e7cdf8-6aa6-4bc5-be38-b00435fc9fe6",
        },
      }
    );
    console.log(JSON.stringify(convertercryptoToDollars.data));
    // console.log("l;k;klk;klk;k;k", convertercryptoToDollars.data);
    return convertercryptoToDollars.data.quote.ETH.price;
  } catch (err) {
    console.log(err);
  }
}

app.get("/demand/insert", async (req, res) => {
  // console.log("hello");
  const {
    crop,
    variety,
    quantity,
    price,
    duration,
    preference,
    description,
    id,
  } = JSON.parse(req.headers.data);
  // console.log(req.headers);
  const transactionHash = req.headers.res;
  // console.log("transaction hash is: ", transactionHash);
  const tx = await provider.getTransaction(transactionHash);
  const reqETH = 0.3 * (await convertMoney(quantity, price));
  if (!tx) {
    return res
      .status(400)
      .json({ success: false, error: "Transaction not found!" });
  }

  // Verify that transaction matches expected values
  if (
    tx.to.toLowerCase() !== FARMING_FACTORY_ADDRESS.toLowerCase() ||
    ethers.formatEther(tx.value) < reqETH

    // || tx.from.toLowerCase() !== sender.toLowerCase()
  ) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid transaction details!" });
  }

  // Wait for transaction confirmation
  const receipt = await provider.waitForTransaction(transactionHash, 1);
  if (!receipt || receipt.status !== 1) {
    return res
      .status(400)
      .json({ success: false, error: "Transaction failed!" });
  }

  // console.log("Transaction verified ✅, uploading demand");
  // console.log(
  //   crop,
  //   variety,
  //   quantity,
  //   price,
  //   duration,
  //   preference,
  //   description,
  //   id
  // );
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
  const tempObj = {
    crop,
    variety,
    quantity,
    price,
    duration,
    preference,
    description,
    contractorID: id,
  };
  const { data: result, error: err } = await supabase
    .from("demand")
    .insert([tempObj])
    .select();
  if (err) {
    console.log(err);
    res
      .status(505)
      .send({ status: "failed", message: "Failed to insert Demand" });
  } else {
    // console.log("demand is inserted bro");
    res.status(201).send({
      status: "success",
      message: "Demand successfully inserted",
    });
  }
  return;
  // con.query(
  //   `insert into demand(crop,variety,quantity,price,duration,preference,description,contractorID) values("${crop}","${variety}",${quantity},${price},${duration},"${preference}","${description}","${id}");`,
  //   (err) => {
  //     if (err) {
  //       req
  //         .status(505)
  //         .send({ status: "failed", message: "Failed to insert Demand" });
  //     } else {
  //       console.log("demand is inserted bro");
  //       res.status(201).send({
  //         status: "success",
  //         message: "Demand successfully inserted",
  //       });
  //     }
  //     return;
  //   }
  // );
});

app.get("/demand/search", async (req, res) => {
  const { crop, variety, price, quantity, preference, duration, PAGE_SIZE } =
    JSON.parse(req.headers.data);
  if (!duration) {
    res.status(400).send({
      status: "failed",
      message: "Invalid duration sent",
    });
    return;
  }
  const { data: result, error: err } = await supabase.rpc("filter_demands", {
    p_quantity_min: quantity[0],
    p_quantity_max: quantity[1],
    p_duration_min: duration[0],
    p_duration_max: duration[1],
    p_preference: preference === "" ? null : `%${preference}%`, // Use NULL for empty strings
    p_price: price,
    p_crop: crop.length > 0 ? crop : null, // Pass NULL if empty
    p_variety: variety.length > 0 ? variety : null, // Pass NULL if empty
    p_page_size: PAGE_SIZE + 1,
  });
  console.log(result);
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
  return; // if (error) console.error("Error fetching demands:", error);
  // else console.log("Filtered demands:", data);
  // con.query(
  //   `select * from demand where quantity between ${quantity[0]} and ${
  //     quantity[1]
  //   } and duration between ${duration[0]} and ${duration[1]} ${
  //     preference === "" ? "" : `and preference like "${preference}"`
  //   } and price>=${price} ${
  //     crop.length > 0 ? `and crop in ("${crop.join(`","`)}")` : ""
  //   } ${
  //     variety.length > 0 ? `and variety in ("${variety.join(`","`)}")` : ""
  //   } order by auto_id limit ${PAGE_SIZE + 1}`,
  //   (err, result) => {
  //     if (err) {
  //       res
  //         .status(505)
  //         .send({ status: "failed", message: "Data could not be fetched" });
  //       return;
  //     }
  //     let hasMore = true;
  //     if (result.length != PAGE_SIZE + 1) hasMore = false;
  //     else result.pop();

  //     res.status(200).send({
  //       result,
  //       cursors: {
  //         next: result.length === 0 ? -1 : result[result.length - 1].auto_id,
  //         prev: result.length === 0 ? -1 : result[0].auto_id,
  //         hasMore,
  //       },
  //       auto_id: result.length === 0 ? -1 : result[result.length - 1].auto_id,
  //       status: "success",
  //       message: "data successfully fetched",
  //     });
  //     return;
  //   }
  // );
});
app.get("/proposal/reject", async (req) => {
  const { farmerID, demandID } = JSON.parse(req.headers.data);
  // console.log(data);
  // console.log(
  //   `update proposal set status='R' where farmerID=${farmerID} and demandID=${demandID}`
  // );

  const { data, error } = await supabase
    .from("proposal")
    .update({ status: "R" })
    .eq("farmerID", farmerID)
    .eq("demandID", demandID)
    .select();

  // con.query(
  //   `update proposal set status='R' where farmerID=${farmerID} and demandID=${demandID}`
  // );
});
app.get("/demand/search/id", async (req, res) => {
  const { id } = JSON.parse(req.headers.data);
  if (!id) {
    res.status(400).send({
      status: "failed",
      message: "Invalid DemandID searched",
    });
    return;
  }
  // const {data:result,}
  const { data: result, error: err } = await supabase
    .from("demand")
    .select("*")
    .eq("auto_id", id);

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
  // con.query(`select * from demand where auto_id=${id}`, (err, result) => {
  //   if (err) {
  //     res.status(505).send({
  //       status: "failed",
  //       message: "Data could not be fetched",
  //     });
  //     return;
  //   } else
  //     res.status(200).send({
  //       result,
  //       status: "success",
  //       message: "data successfully fetched",
  //     });
  //   return;
  // });
});
app.get("/demand/search/prev", async (req, res) => {
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
  const { data: result, error: err } = await supabase.rpc(
    "filter_demands_prev",
    {
      p_quantity_min: quantity[0],
      p_quantity_max: quantity[1],
      p_duration_min: duration[0],
      p_duration_max: duration[1],
      p_preference: preference === "" ? null : `%${preference}%`, // Use NULL for empty strings
      p_price: price,
      p_crop: crop.length > 0 ? crop : null, // Pass NULL if empty
      p_variety: variety.length > 0 ? variety : null, // Pass NULL if empty
      p_auto_id: cursors.prev,
      p_page_size: PAGE_SIZE + 1,
    }
  );
  if (err) {
    res.status(505).send({
      status: "failed",
      message: "Data could not be fetched",
    });
    return;
  }
  result.reverse();
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

  // con.query(
  //   `select * from demand where quantity between ${quantity[0]} and ${
  //     quantity[1]
  //   } and duration between ${duration[0]} and ${duration[1]}${
  //     preference === "" ? "" : `and preference like "${preference}"`
  //   } and price>=${price} ${
  //     crop.length > 0 ? `and crop in ("${crop.join(`","`)}")` : ""
  //   } ${
  //     variety.length > 0 ? `and variety in ("${variety.join(`","`)}")` : ""
  //   } and auto_id<${cursors.prev} order by auto_id desc limit ${PAGE_SIZE};`,
  //   (err, result) => {
  //     if (err) {
  //       res.status(505).send({
  //         status: "failed",
  //         message: "Data could not be fetched",
  //       });
  //       return;
  //     }
  //     result.reverse();
  //     res.send({
  //       result,
  //       cursors: {
  //         next: result.length === 0 ? -1 : result[result.length - 1].auto_id,
  //         prev: result.length === 0 ? -1 : result[0].auto_id,
  //         hasMore: true,
  //       },
  //       auto_id: result.length === 0 ? -1 : result[0].auto_id,
  //       status: "success",
  //       message: "data successfully fetched",
  //     });
  //     return;
  //   }
  // );
});

app.get("/demand/search/next", async (req, res) => {
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
  // console.log(
  //   `select * from demand where quantity between ${quantity[0]} and ${
  //     quantity[1]
  //   } and duration between ${duration[0]} and ${duration[1]} ${
  //     preference === "" ? "" : `and preference like "${preference}"`
  //   } and price>=${price} ${
  //     crop.length > 0 ? `and crop in ("${crop.join(`","`)}")` : ""
  //   } ${
  //     variety.length > 0 ? `and variety in ("${variety.join(`","`)}")` : ""
  //   } and auto_id>${cursors.next} order by auto_id limit ${PAGE_SIZE + 1};`
  // );
  const { data: result, error: err } = await supabase.rpc(
    "filter_demands_next",
    {
      p_quantity_min: quantity[0],
      p_quantity_max: quantity[1],
      p_duration_min: duration[0],
      p_duration_max: duration[1],
      p_preference: preference === "" ? null : `%${preference}%`, // Use NULL for empty strings
      p_price: price,
      p_crop: crop.length > 0 ? crop : null, // Pass NULL if empty
      p_variety: variety.length > 0 ? variety : null, // Pass NULL if empty
      p_auto_id: cursors.next,
      p_page_size: PAGE_SIZE + 1,
    }
  );
  console.log(result);
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
  return;
  // con.query(
  //   `select * from demand where quantity between ${quantity[0]} and ${
  //     quantity[1]
  //   } and duration between ${duration[0]} and ${duration[1]} ${
  //     preference === "" ? "" : `and preference like "${preference}"`
  //   } and price>=${price} ${
  //     crop.length > 0 ? `and crop in ("${crop.join(`","`)}")` : ""
  //   } ${
  //     variety.length > 0 ? `and variety in ("${variety.join(`","`)}")` : ""
  //   } and auto_id>${cursors.next} order by auto_id limit ${PAGE_SIZE + 1};`,
  //   (err, result) => {
  //     if (err) {
  //       res.status(505).send({
  //         status: "failed",
  //         message: "Data could not be fetched",
  //       });
  //       return;
  //     }
  //     let hasMore = true;
  //     if (result.length != PAGE_SIZE + 1) hasMore = false;
  //     else result.pop();

  //     res.send({
  //       result,
  //       cursors: {
  //         next: result.length === 0 ? -1 : result[result.length - 1].auto_id,
  //         prev: result.length === 0 ? -1 : result[0].auto_id,
  //         hasMore,
  //       },
  //       auto_id: result.length === 0 ? -1 : result[0].auto_id,
  //       status: "success",
  //       message: "data successfully fetched",
  //     });
  //     return;
  //   }
  // );
});

app.post("/signup/contractor", async (req, res) => {
  const { email, password, contractor_name, wallet_address } = req.body;
  const { data: result, error: err } = await supabase
    .from("contractor")
    .select("*")
    .eq("email", email);
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

  bcrypt.hash(password.toString(), salt, async (erro, hash) => {
    if (erro) {
      res
        .status(505)
        .send({ status: "failed", message: "User could not be created" });
      return;
    }
    const { data: res, error: err } = await supabase
      .from("contractor")
      .insert([
        {
          contractor_name: contractor_name,
          email,
          password: hash,
          wallet_address,
        },
      ])
      .select();
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
    // con.query(
    //   `insert into contractor(contractor_name,email,password,wallet_address) values("${contractor_name}","${email}","${hash}","${wallet_address}")`,
    //   (err) => {
    //     if (err) {
    //       res.status(505).send({
    //         status: "failed",
    //         message: "User could not be created",
    //       });
    //       return;
    //     }

    //     res.status(200).send({
    //       status: "success",
    //       message: "User created",
    //     });
    //     return;
    //   }
    // );
  });
  // con.query(
  //   `select * from contractor where email="${email}";`,
  //   (err, result) => {
  //     if (err) {
  //       res.status(505).send({
  //         status: "failed",
  //         message: "Data could not be verified/inserted",
  //       });
  //       return;
  //     }
  //     if (result?.length > 0) {
  //       res
  //         .status(400)
  //         .send({ status: "failed", message: "email registered already" });
  //       return;
  //     }

  //     bcrypt.hash(password.toString(), salt, (err, hash) => {
  //       if (err) {
  //         res
  //           .status(505)
  //           .send({ status: "failed", message: "User could not be created" });
  //         return;
  //       }

  //       con.query(
  //         `insert into contractor(contractor_name,email,password) values("${contractor_name}","${email}","${hash}")`,
  //         (err) => {
  //           if (err) {
  //             res.status(505).send({
  //               status: "failed",
  //               message: "User could not be created",
  //             });
  //             return;
  //           }

  //           res.status(200).send({
  //             status: "success",
  //             message: "User created",
  //           });
  //           return;
  //         }
  //       );
  //     });
  //   }
  // );
});
app.post("/signup/farmer", async (req, res) => {
  const { email, password, wallet_address, farmer_name } = req.body;
  const { data: result, error: err } = await supabase
    .from("farmer")
    .select("*")
    .eq("email", email);
  if (result?.length > 0) {
    res.status(400).send({ status: "failed", error: "email not registered" });
    return;
  }

  bcrypt.hash(password.toString(), salt, async (erro, hash) => {
    if (erro) {
      res.status(505).send({
        status: "failed",
        message: "User could not be created",
      });
      return;
    }
    const { error: err } = await supabase
      .from("farmer")
      .insert([{ email, password: hash, wallet_address, farmer_name }])
      .select();
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

    // con.query(
    //   `insert into farmer(email,password) values("${email}","${hash}")`,
    //   (err) => {
    //     if (err) {
    //       res.status(505).send({
    //         status: "failed",
    //         message: "User could not be created",
    //       });
    //       return;
    //     }

    //     res.status(200).send({
    //       status: "success",
    //       message: "User created",
    //     });
    //     return;
    //   }
    // );
  });
  // con.query(`select * from farmer where email="${email}";`, (err, result) => {
  //   if (result?.length > 0) {
  //     res.status(400).send({ status: "failed", error: "email not registered" });
  //     return;
  //   }

  //   bcrypt.hash(password.toString(), salt, (err, hash) => {
  //     if (err) {
  //       res.status(505).send({
  //         status: "failed",
  //         message: "User could not be created",
  //       });
  //       return;
  //     }
  //     con.query(
  //       `insert into farmer(email,password) values("${email}","${hash}")`,
  //       (err) => {
  //         if (err) {
  //           res.status(505).send({
  //             status: "failed",
  //             message: "User could not be created",
  //           });
  //           return;
  //         }

  //         res.status(200).send({
  //           status: "success",
  //           message: "User created",
  //         });
  //         return;
  //       }
  //     );
  //   });
  // });
});

app.get("/refresh", async (req, res) => {
  // console.log("kk");
  // console.log(req.headers);
  const { refreshToken } = req.cookies;
  // const { role, id, password } =
  let decoded = {};
  try {
    decoded = await jwt.verify(refreshToken, jwtSecret);
  } catch (error) {
    // console.log("yolo");
    // console.log(error);
    res.status(400).send({
      status: "failed",
      message: `ExpiredRefresh ${JSON.stringify(req.cookies)}`,
    });
    return;
  }
  // console.log(decoded);
  const { id, role } = decoded;
  if (!refreshToken) {
    res.status(401).send({ message: "Invalid" });
  }

  const { data: result, error: err } = await supabase
    .from("refreshLogin")
    .select("*")
    .eq("id", id)
    .eq("role", role);
  console.log("moma lelo ", result, err);
  if (err || result.length == 0) {
    res.status(505).send({ status: "failed", message: "Invalid Login" });
    return;
  }
  const unHash_token = bcrypt.compare(
    refreshToken,
    result[0].refreshToken,
    (err, isMatch) => {
      if (err || !isMatch) {
        res.status(400).send({ status: "failed", message: "invalid" });
        return;
      }

      if (isMatch) {
        const id =
          req.headers.role === "farmer"
            ? result[0].farmerID
            : result[0].contractorID;
        const accessToken = jwt.sign(
          {
            email: req.headers.email,
            role: req.headers.role,
            id:
              req.headers.role === "farmer"
                ? result[0].farmerID
                : result[0].contractorID,
          },
          jwtSecret,
          { expiresIn: 20 }
        );
        // console.log("just sendin'");
        res.status(200).send({
          accessToken,
          id,
        });
        return;
      }
    }
  );
  // con.query(
  //   `select refreshToken from refreshLogin where id=${id} and role='${role}'`,
  //   (err, result) => {
  //     // console.log(result);
  //     if (err || result.length == 0) {
  //       res.status(505).send({ status: "failed", message: "Invalid Login" });
  //       return;
  //     }
  //     const unHash_token = bcrypt.compare(
  //       refreshToken,
  //       result[0].refreshToken,
  //       (err, isMatch) => {
  //         if (err || !isMatch) {
  //           res.status(400).send({ status: "failed", message: "invalid" });
  //           return;
  //         }

  //         if (isMatch) {
  //           const id =
  //             req.headers.role === "farmer"
  //               ? result[0].farmerID
  //               : result[0].contractorID;
  //           const accessToken = jwt.sign(
  //             {
  //               email: req.headers.email,
  //               role: req.headers.role,
  //               id:
  //                 req.headers.role === "farmer"
  //                   ? result[0].farmerID
  //                   : result[0].contractorID,
  //             },
  //             jwtSecret,
  //             { expiresIn: 20 }
  //           );
  //           // console.log("just sendin'");
  //           res.status(200).send({
  //             accessToken,
  //             id,
  //           });
  //           return;
  //         }
  //       }
  //     );
  //   }
  // );
});
app.get("/details", async (req, res) => {
  const { id } = req.headers;
  if (!id) {
    res.status(400).send({
      status: "failed",
      message: "data invalid",
    });
    return;
  }
  try {
    const { data: result, error: err } = await supabase
      .from("demand")
      .select("*")
      .eq("auto_id", id);
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
    // con.query(`select * from demand where auto_id=${id};`, (err, result) => {
    //   if (err) {
    //     res.status(505).send({
    //       status: "failed",
    //       message: "Data could not be fetched",
    //     });
    //     return;
    //   }
    //   res.status(200).send({
    //     result,
    //     status: "success",
    //     message: "Data successfully fetched",
    //   });
    // });
  } catch (err) {}
});
app.get("/:role/demand/pending", async (req, res) => {
  // console.log("hello");
  const { data } = req.headers;
  const { id } = JSON.parse(data);
  if (!id) {
    res.status(400).send({
      status: "failed",
      message: "data invalid",
    });
    return;
  }
  const { data: result, error } = await supabase
    .from("demand")
    .select("*")
    .eq(`${req.params.role}ID`, id)
    .eq("status", "pending");
  // console.log("inpendinngdemands ", `${req.params.role}ID`, id);
  if (error) {
    res.status(505).send({
      status: "failed",
      message: "data could  not be fetched",
    });
    return;
  }
  res.status(200).send(result);
  return;
  // con.query(
  //   `select * from demand where ${req.params.role}ID=${id} and status='pending';`,
  //   (error, result) => {
  //     if (error) {
  //       res.status(505).send({
  //         status: "failed",
  //         message: "data could  not be fetched",
  //       });
  //       return;
  //     }
  //     res.status(200).send(result);
  //     return;
  //   }
  // );
});
app.get("/farmer/demand/pending", async (req, res) => {
  const { data } = req.headers;
  const { id } = JSON.parse(data);
  // console.log("hello");
  if (!id) {
    res.status(400).send({
      status: "failed",
      message: "data invalid",
    });
    return;
  }
  const { data: result, error } = await supabase
    .from("demand")
    .select("*")
    .eq("farmerID", id)
    .eq("status", "pending");
  if (error) {
    res.status(505).send({
      status: "failed",
      message: "data could  not be fetched",
    });
    return;
  }
  // console.log(result);
  res.status(200).send(result);
  return;
  // con.query(
  //   `select * from demand where farmerID=${id} and status='pending';`,
  //   (error, result) => {
  //     if (error) {
  //       res.status(505).send({
  //         status: "failed",
  //         message: "data could  not be fetched",
  //       });
  //       return;
  //     }
  //     // console.log(result);
  //     res.status(200).send(result);
  //     return;
  //   }
  // );
});
app.get("/:role/demand/partial", async (req, res) => {
  const { data } = req.headers;
  const { id } = JSON.parse(data);
  if (!id) {
    res.status(400).send({
      status: "failed",
      message: "data invalid",
    });
    return;
  }
  // console.log("hello in pending demandds", `${req.params.role}ID`, id);
  const { data: result, error } = await supabase
    .from("demand")
    .select("*")
    .eq(`${req.params.role}ID`, id)
    .eq("status", "partial");
  // console.log(result, error);

  // console.log("hello gay", result, error);
  if (error) {
    res.status(505).send({
      status: "failed",
      message: "data could  not be fetched",
    });
    return;
  }
  res.status(200).send(result);
  return;
  // con.query(
  //   `select * from demand where ${req.params.role}ID=${id} and status='partial';`,
  //   (error, result) => {
  //     if (error) {
  //       res.status(505).send({
  //         status: "failed",
  //         message: "data could  not be fetched",
  //       });
  //       return;
  //     }
  //     res.status(200).send(result);
  //     return;
  //   }
  // );
});
app.get("/:role/demand/ongoing", async (req, res) => {
  // console.log("int it bro u are");
  const { data } = req.headers;
  const { id } = JSON.parse(data);
  // console.log(id);
  if (!id) {
    res.status(400).send({
      status: "failed",
      message: "data invalid",
    });
    return;
  }
  const { data: result, error } = await supabase
    .from("ongoingContracts")
    .select("*")
    .eq(`${req.params.role}ID`, id);
  // console.log("ongoing demandd ", error, result);
  if (error) {
    // console.log("error in ongoing", error);
    res.status(505).send({
      status: "failed",
      message: "data could  not be fetched",
    });
    return;
  }
  res.status(200).send(result);
  return;
  // con.query(
  //   `select * from ongoingContracts where ${req.params.role}ID=${id};`,
  //   (error, result) => {
  //     if (error) {
  //       res.status(505).send({
  //         status: "failed",
  //         message: "data could  not be fetched",
  //       });
  //       return;
  //     }
  //     res.status(200).send(result);
  //     return;
  //   }
  // );
});
app.get("/signin/verify", async (req, res) => {
  if (req.user) {
    res.status(200).send({ status: "success", message: "verified" });
  } else res.status(400).send({ status: "failed", message: "Auth failed" });
});
app.get("/signin/verify/protect", async (req, res) => {
  if (req.user) {
    res
      .status(200)
      .send({ status: "success", message: "verified", user: req.user });
  } else res.status(400).send({ status: "failed", message: "Auth failed" });
});
app.get("/update", async (req, res) => {
  const data = JSON.parse(req.headers.data);
  delete data["created_at"];
  // console.log(
  //   `replace into demand(${Object.entries(data)
  //     .map((entries) => JSON.stringify(entries[0]))
  //     .join(",")}) values(${Object.entries(data)
  //     .map((entries) => JSON.stringify(entries[1]))
  //     .join(",")})`
  // );
  // console.log(data);
  const { data: result, error: err } = await supabase
    .from("demand")
    .upsert([data])
    .select(); // `upsert` automatically inserts or updates
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

  // con.query(
  //   `replace into demand(${Object.entries(data)
  //     .map((entries) => entries[0])
  //     .join(",")}) values(${Object.entries(data)
  //     .map((entries) => JSON.stringify(entries[1]))
  //     .join(",")})`,
  //   (err) => {
  //     if (err) {
  //       res.status(500).send({
  //         status: "failed",
  //         message: "Internal error",
  //       });
  //       return;
  //     } else
  //       res.status(200).send({
  //         status: "success",
  //         message: "data fetched",
  //       });
  //     return;
  //   }
  // );

  await supabase
    .from("proposal")
    .update({ status: "U" })
    .eq("demandID", data.auto_id)
    .eq("status", "P")
    .select();
  // con.query(
  //   `update proposal set status='U' where demandID=${data.auto_id} and status='P';`
  // );
});
app.get("/proposal/insert", async (req, res) => {
  const data = JSON.parse(req.headers.data);
  // data.contractorID=
  // console.log("klklkkklklkl", data);
  await supabase
    .from("proposal")
    .delete()
    .eq("farmerID", data.farmerID)
    .eq("demandID", data.demandID);
  // con.query(
  //   `delete from proposal where farmerID=${data.farmerID} and demandID=${data.demandID}`
  // );

  await supabase.from("proposal").insert([data]).select();
  // con.query(
  //   `insert into proposal(${Object.entries(data)
  //     .map((object) => object[0])
  //     .join(",")}) values(${Object.entries(data).map((object) =>
  //     JSON.stringify(object[1])
  //   )})`
  // );
  res.status(200).send({ status: "success", messaage: "Successfully sent" });
});
app.get("/proposal/search", async (req, res) => {
  const { id } = req.headers;
  if (!id) {
    res.status(400).send({ status: "failed", message: "data invalid" });
    return;
  }
  const { data: result, error: err } = await supabase
    .from("proposal")
    .select("*")
    .eq("contractorID", id);
  if (err) {
    res
      .status(505)
      .send({ status: "failed", message: "data could not be searched" });
    return;
  }
  res.send({ result, status: "success" });
  return;
  // con.query(
  //   `select * from proposal where contractorID=${id};`,
  //   (err, result) => {
  //     if (err) {
  //       res
  //         .status(505)
  //         .send({ status: "failed", message: "data could not be searched" });
  //       return;
  //     }
  //     res.send({ result, status: "success" });
  //     return;
  //   }
  // );
});
app.listen(3000, () => {
  console.log("Server Started");
  // console.log(`Smart contract is deployed at: ${contractAddress}`);
});
app.get("/farmer/proposals", async (req, res) => {
  // console.log("lklkl", "hello");
  const { id } = JSON.parse(req.headers.data);
  // console.log(id);
  const { data: result, error: err } = await supabase
    .from("proposal")
    .select("*")
    .eq("farmerID", id);
  if (err) {
    res.send({ status: "failed", message: "data couldn.t be fetched" });
    return;
  }
  // console.log(result);
  res.send({ result, status: "success", message: "data fetched" });
  // con.query(`select * from proposal where farmerID=${id};`, (err, result) => {
  //   if (err) {
  //     res.send({ status: "failed", message: "data couldn.t be fetched" });
  //     return;
  //   }
  //   console.log(result);
  //   res.send({ result, status: "success", message: "data fetched" });
  // });
});
app.get("/proposal/:demandID", async (req, res) => {
  // console.log(req);
  // console.log(req.params);
  // console.log(`select * from proposals where demandID=${req.params.demandID}`);
  const { data: result, error: err } = await supabase
    .from("proposal")
    .select("*")
    .eq("demandID", req.params.demandID);
  if (err) {
    // console.log("hello");
    res.send({ status: 505, message: "data could not be fetched" });
    return;
  }
  // console.log(result);
  res.send({ result, status: 200, message: "data successfully fetched" });
  // con.query(
  //   `select * from proposal where demandID=${req.params.demandID};`,
  //   (err, result) => {
  //     if (err) {
  //       // console.log("hello");
  //       res.send({ status: 505, message: "data could not be fetched" });
  //       return;
  //     }
  //     // console.log(result);
  //     res.send({ result, status: 200, message: "data successfully fetched" });
  //   }
  // );
});
app.get("/proposal/accepted/:demandID", async (req, res) => {
  // console.log(req.headers, "kkkkkkkkkkkkkkkkkkkkkk");
  // console.log("kelo lelo");
  let {
    demandID,
    farmerID,
    price,
    description: farmerDesc,
    duration,
  } = JSON.parse(req.headers.proposal);
  // console.log(demandID, farmerID, duration);
  farmerDesc = "FarmerDescription: " + farmerDesc;
  try {
    // console.log("lolo");
    let { data, error } = await supabase.rpc("update_proposal_status", {
      demand_id: demandID, // Replace with actual demandID
      farmer_id: farmerID, // Replace with actual farmerID
    });
    // console.log("updated demand", data, error);
    if (error) {
      console.error("Error calling function:", error);
    } else {
      console.log("Function executed successfully", data);
    }
    // con.query(
    //   `update proposal set status=CASE
    //  when demandID=${demandID} and farmerID=${farmerID} then 'AC'
    //  when demandID=${demandID} then 'R'
    //  end where demandID=${demandID};`,
    //   () => {
    //     console.log("gogo");
    //   }
    // );
    // console.log("kokoo");
    // console.log(`update demand set price=${price},
    //  duration=${duration},
    //  description=concat(description,farmerDesc),
    //  contractor_approval=true
    //  where demandID=${demandID};`);

    //make contract now instead of updating
    await supabase
      .from("demand")
      .update({ duration: duration, price: price })
      .eq("auto_id", demandID)
      .select();
    // await con.query(
    //   `update demand set price=${price},
    //  duration=${duration},
    //  description=concat(description,'${farmerDesc}'),
    //  contractor_approval=true,
    //  status='partial'
    //  where auto_id=${demandID};`
    // );
    let contractData = [];
    const { data: result, error: err } = await supabase
      .from("demand")
      .select("*")
      .eq("auto_id", demandID);
    // console.log("selected demand", result[0], err);
    contractData = result[0];
    // console.log(contractData);
    if (!contractData) {
      res.send({ message: "no demand found", status: "success" });
      return;
    }
    const {
      quantity,
      variety,
      crop,
      // duration,
      // price,
      auto_id,
      contractorID,
      // farmerID,
      created_at,
    } = contractData;
    // console.log(contractData);
    try {
      const unixTimestamp = new Date(created_at).getTime() / 1000;
      // console.log(unixTimestamp);
      const convertercryptoToDollars = await axios.get(
        "https://pro-api.coinmarketcap.com/v2/tools/price-conversion",
        {
          params: {
            amount: quantity * price,
            symbol: "INR",
            convert: "ETH",
          },
          headers: {
            "X-CMC_PRO_API_KEY": process.env.COIN_MARKET_KEY,
          },
        }
      );
      // console.log("i am in it tryin to create it");
      let { data: farmer_wallet, error: ert } = await supabase
        .from("farmer")
        .select("wallet_address")
        .eq("farmerID", farmerID);
      // console.log("selected farmer wwallet ", farmer_wallet, ert);
      // await new Promise((resolve, reject) => {
      //   con.query(
      //     `select wallet_address from farmer where farmerID=${farmerID}`,
      //     (error, results) => {
      //       if (error) reject(error);
      //       resolve(results || {});
      //     }
      //   );
      // });
      let { data: contractor_wallet, error: erty } = await supabase
        .from("contractor")
        .select("wallet_address")
        .eq("contractorID", contractorID);
      // console.log("selecting contractor wallet", contractor_wallet, erty);
      // await new Promise((resolve, reject) => {
      //   con.query(
      //     `select wallet_address from contractor where contractorID=${contractorID}`,
      //     (error, results) => {
      //       if (error) reject(error);
      //       resolve(results || {});
      //     }
      //   );
      // });
      farmer_wallet = farmer_wallet[0].wallet_address;
      contractor_wallet = contractor_wallet[0].wallet_address;
      // const contractor_wallet=await con.query(`select wallet_address from contractor where contractorID=${contractorID}`);
      //   const farmer_wallet=await con.query(`select wallet_address from farmer where farmerID=${farmerID}`);
      // console.log(
      //   ethers
      //     .parseEther(
      //       convertercryptoToDollars.data.data[0].quote.ETH.price.toFixed(18)
      //     )
      //     .toString()
      // );

      // console.log(
      //   farmer_wallet,
      //   contractor_wallet,
      //   auto_id,
      //   crop,
      //   variety,
      //   duration,
      //   price,
      //   quantity,
      //   farmerID,
      //   contractorID,
      //   ethers.parseEther(
      //     convertercryptoToDollars.data.data[0].quote.ETH.price.toFixed(18)
      //   )
      // );
      const tx = await farmingFactory.createFarmingContractT2(
        farmer_wallet,
        contractor_wallet,
        auto_id,
        crop,
        variety,
        duration,
        price,
        quantity,
        farmerID,
        contractorID,
        ethers.parseEther(
          convertercryptoToDollars.data.data[0].quote.ETH.price.toFixed(18)
        )
      );
      // console.log(`Transaction sent: ${tx.hash}`);
      // console.log()
      await tx.wait(); // Wait for confirmation
      // console.log(tx);
      const { data, error } = await supabase
        .from("ongoingContracts")
        .insert([
          {
            contractorID,
            farmerID,
            contractID: demandID,
            crop,
            variety,
            price,
            quantity,
            duration,
          },
        ])
        .select();
      // console.log("inserting contract in ", data, error);
      // con.query(
      //   `insert into ongoingContracts(contractorID, farmerID,contractID,crop,variety,price,quantity,duration) values(${contractorID},${farmerID},${demandID},'${crop}','${variety}',${price},${quantity},${duration});`
      // );

      // await con.query(`delete from demand where auto_id=${demandID};`);
      const { error: errr } = await supabase
        .from("proposal")
        .delete()
        .eq("demandID", demandID);
      const { error: er } = await supabase
        .from("demand")
        .delete()
        .eq("auto_id", demandID);
      // console.log("updating tables at last", er, errr);
      // con.query(`delete from proposal where demandID=${demandID};`);
      res.send({ transactionHash: tx.hash, status: "success" });
    } catch (err) {
      console.log(err);
      res.status(400).send({ status: "failed" });
    }
    // await con.query(
    //   `select * from demand where auto_id=${demandID}`,
    //   async (err, result) => {
    //     console.log(result[0]);
    //     contractData = result[0];
    //     console.log(contractData);
    //     if (!contractData) {
    //       res.send({ message: "no demand found", status: "success" });
    //       return;
    //     }
    //     const {
    //       quantity,
    //       variety,
    //       crop,
    //       // duration,
    //       // price,
    //       auto_id,
    //       contractorID,
    //       // farmerID,
    //       created_at,
    //     } = contractData;
    //     console.log(contractData);
    //     try {
    //       const unixTimestamp = new Date(created_at).getTime() / 1000;
    //       console.log(unixTimestamp);
    //       const convertercryptoToDollars = await axios.get(
    //         "https://pro-api.coinmarketcap.com/v2/tools/price-conversion",
    //         {
    //           params: {
    //             amount: quantity * price,
    //             symbol: "INR",
    //             convert: "ETH",
    //           },
    //           headers: {
    //             "X-CMC_PRO_API_KEY": "18e7cdf8-6aa6-4bc5-be38-b00435fc9fe6",
    //           },
    //         }
    //       );
    //       console.log("i am in it tryin to create it");
    //       let farmer_wallet = await new Promise((resolve, reject) => {
    //         con.query(
    //           `select wallet_address from farmer where farmerID=${farmerID}`,
    //           (error, results) => {
    //             if (error) reject(error);
    //             resolve(results || {});
    //           }
    //         );
    //       });
    //       let contractor_wallet = await new Promise((resolve, reject) => {
    //         con.query(
    //           `select wallet_address from contractor where contractorID=${contractorID}`,
    //           (error, results) => {
    //             if (error) reject(error);
    //             resolve(results || {});
    //           }
    //         );
    //       });
    //       farmer_wallet = farmer_wallet[0].wallet_address;
    //       contractor_wallet = contractor_wallet[0].wallet_address;
    //       // const contractor_wallet=await con.query(`select wallet_address from contractor where contractorID=${contractorID}`);
    //       //   const farmer_wallet=await con.query(`select wallet_address from farmer where farmerID=${farmerID}`);
    //       console.log(
    //         ethers
    //           .parseEther(
    //             convertercryptoToDollars.data.data[0].quote.ETH.price.toFixed(
    //               18
    //             )
    //           )
    //           .toString()
    //       );

    //       console.log(
    //         farmer_wallet,
    //         contractor_wallet,
    //         auto_id,
    //         crop,
    //         variety,
    //         duration,
    //         price,
    //         quantity,
    //         farmerID,
    //         contractorID,
    //         ethers.parseEther(
    //           convertercryptoToDollars.data.data[0].quote.ETH.price.toFixed(18)
    //         )
    //       );
    //       const tx = await farmingFactory.createFarmingContractT2(
    //         farmer_wallet,
    //         contractor_wallet,
    //         auto_id,
    //         crop,
    //         variety,
    //         duration,
    //         price,
    //         quantity,
    //         farmerID,
    //         contractorID,
    //         ethers.parseEther(
    //           convertercryptoToDollars.data.data[0].quote.ETH.price.toFixed(18)
    //         )
    //       );
    //       console.log(`Transaction sent: ${tx.hash}`);
    //       // console.log()
    //       await tx.wait(); // Wait for confirmation
    //       console.log(tx);
    //       con.query(
    //         `insert into ongoingContracts(contractorID, farmerID,contractID,crop,variety,price,quantity,duration) values(${contractorID},${farmerID},${demandID},'${crop}','${variety}',${price},${quantity},${duration});`
    //       );
    //       con.query(`delete from demand where auto_id=${demandID};`);
    //       con.query(`delete from proposal where demandID=${demandID};`);
    //       res.send({ transactionHash: tx.hash, status: "success" });
    //     } catch (err) {
    //       console.log(err);
    //       res.status(400).send({ status: "failed" });
    //     }
    //   }
    // );
  } catch (err) {
    // console.log(err);
    res.status(505).send({
      status: "failed",
      message: "internal server error updates could not take place",
    });
    return;
  }
  // res.status(200).send({ status: "success", message: "updates done" });
});
app.get("/makeContract", async (req, res) => {
  console.log("hello");
  const {
    quantity,
    variety,
    crop,
    duration,
    price,
    auto_id,
    contractorID,
    farmerID,
    created_at,
  } = JSON.parse(req.headers.demand);
  try {
    const iso8601 = new Date(created_at).toISOString();
    // console.log(iso8601);
    const convertercryptoToDollars = await axios.get(
      "https://pro-api.coinmarketcap.com/v2/tools/price-conversion",
      {
        params: {
          amount: quantity * price,
          symbol: "INR",
          convert: "ETH",
          time: iso8601,
        },
        headers: {
          "X-CMC_PRO_API_KEY": process.env.COIN_MARKET_API,
        },
      }
    );
    // const contractor_wallet = await con.query(
    //   `select wallet_address from contractor where contractorID=${contractorID}`
    // );
    // const farmer_wallet = await con.query(
    //   `select wallet_address from farmer where contractorID=${farmerID}`
    // );
    // console.log(
    //   ethers.parseEther(convertercryptoToDollars.data.quote.ETH.price)
    // );
    const tx = await farmingFactory.createFarmingContractT2(
      farmer_wallet,
      contractor_wallet,
      auto_id,
      crop,
      variety,
      duration,
      price,
      quantity,
      farmerID,
      contractorID,
      ethers.parseEther(convertercryptoToDollars.data.quote.ETH.price)
    );
    // console.log(`Transaction sent: ${tx.hash}`);
    await tx.wait(); // Wait for confirmation
    // console.log(tx);
    // con.query(
    //   `insert into ongoingContracts(contractorID, farmerID,contractID) values(${contractorID},${farmerID},${demandID});`
    // );
    res.send({ transactionHash: tx.hash, status: "success" });
  } catch (err) {
    console.log(err);
  }
});
app.get("/searchContract", async (req, res) => {
  const { demandid } = req.headers;
  // console.log(req.headers, Number(demandid));
  const x = await farmingFactory.getDetails(demandid);
  // getAddressDemand;
  const y = await farmingFactory.getAddressDemand(Number(demandid));
  // console.log(y);
  // res.send("ok");
  res.send({
    result: JSON.parse(
      JSON.stringify(x, (_, v) => (typeof v === "bigint" ? v.toString() : v))
    ),
    status: "success",
    message: "data successfully fetched",
  });
});
async function payment(req, res) {
  try {
    let { amount } = req.headers;
    if (!amount) amount = 1000;
    const data = {
      merchantId: "PGTESTPAYUAT",
      merchantTransactionId: "MT7850590068188104",
      merchantUserId: "MUID123",
      amount: amount,
      redirectUrl: "https://localhost:3000/pay-return-url",
      redirectMode: "REDIRECT",
      callbackUrl: "https://localhost:3000/pay-return-url",
      mobileNumber: "9999999999",
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };
    const payload = JSON.stringify(data);
    const payloadMain = Buffer.from(payload, "utf8").toString("base64");
    const salt_index = 1;
    const string = payloadMain + "/pg/v1/pay" + salt_index;
    const sha256 = createHash("sha256").update(string).digest("hex");
    const checksum = sha256 + "###" + salt_index;
    const options = {
      method: "post",
      url: "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay", //prod_url
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      data: {
        request: payloadMain,
      },
    };
    axios
      .request(options)
      .then(function (response) {
        // console.log(response.data);
        return res.redirect(
          response.data.data.instrumentResponse.redirectInfo.url
        );
      })
      .catch(function (error) {
        // console.error(error);
        res.status(500).send({
          message: error.message,
          success: false,
        });
      });
  } catch (err) {
    // console.log(err);
    res.status(500).send({
      message: err.message,
      success: false,
    });
  }
}
const checkStatus = async (req, res) => {
  const merchantTransactionId = req.params.txnId;
  const merchantId = "PGTESTPAYUAT";
  const keyIndex = 1;
  const string =
    `/pg/v1/status/${merchantId}/${merchantTransactionId}` +
    process.env.SALT_KEY;
  const sha256 = crypto.createHash("sha256").update(string).digest("hex");
  const checksum = sha256 + "###" + keyIndex;
  const options = {
    method: "GET",
    url: `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${merchantTransactionId}`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
      "X-MERCHANT-ID": `${merchantId}`,
    },
  };
  axios
    .request(options)
    .then(async (response) => {
      if (response.data.success === true) {
        // console.log(response.data);
        return res
          .status(200)
          .send({ success: true, message: "Payment Success" });
      } else {
        return res
          .status(400)
          .send({ success: false, message: "Payment Failure" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ msg: err.message });
    });
};
app.get("/payment", payment);
app.get("/status/:txnId", checkStatus);

app.get("/get-wallet", async (req, res) => {
  try {
    // Sign the contract address
    const signature = await wallet.signMessage(FARMING_FACTORY_ADDRESS);

    res.json({
      address: FARMING_FACTORY_ADDRESS,
      signature,
      publicKey: wallet.address,
    });
  } catch (error) {
    // console.error("Signing Error:", error);
    res.status(500).json({ error: "Error signing the address" });
  }
});
app.get("/convertMoney", async (req, res) => {
  const data = JSON.parse(req.headers.data);
  // console.log(data);
  try {
    const convertercryptoToDollars = await axios.get(
      "https://pro-api.coinmarketcap.com/v2/tools/price-conversion",
      {
        params: {
          amount: data.quantity * data.price,
          symbol: "INR",
          convert: "ETH",
        },
        headers: {
          "X-CMC_PRO_API_KEY": process.env.COIN_MARKET_API,
        },
      }
    );
    // console.log(JSON.stringify(convertercryptoToDollars.data));
    // console.log(convertercryptoToDollars.data.data);
    convertercryptoToDollars.data.data[0].quote.ETH.price =
      0.5 * convertercryptoToDollars.data.data[0].quote.ETH.price;
    // console.log("l;k;klk;klk;k;k", convertercryptoToDollars.data);
    res.json({
      data: JSON.stringify(convertercryptoToDollars.data),
    });
  } catch (err) {
    console.log(err);
  }
});
app.get("/convertMoneyRest", async (req, res) => {
  const data = JSON.parse(req.headers.data);
  // console.log(data);
  try {
    const convertercryptoToDollars = await axios.get(
      "https://pro-api.coinmarketcap.com/v2/tools/price-conversion",
      {
        params: {
          amount: data.quantity * data.price,
          symbol: "INR",
          convert: "ETH",
        },
        headers: {
          "X-CMC_PRO_API_KEY": process.env.COIN_MARKET_API,
        },
      }
    );
    // console.log(JSON.stringify(convertercryptoToDollars.data));
    // console.log(convertercryptoToDollars.data.data);
    convertercryptoToDollars.data.data[0].quote.ETH.price =
      0.6 * convertercryptoToDollars.data.data[0].quote.ETH.price;
    // console.log("l;k;klk;klk;k;k", convertercryptoToDollars.data);
    res.json({
      data: JSON.stringify(convertercryptoToDollars.data),
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/getContractAddress", async (req, res) => {
  // console.log(
  //   "hellllllllllllllllllllllllllllllllllllllllllllllooooooooooooooooooooooooo"
  // );
  // console.log(req.headers);
  let demandNo = req.headers.contractid;
  demandNo = Number(demandNo);
  // console.log(demandNo);
  const tx = await farmingFactory.getContractAddress(demandNo);
  //
  // console.log(tx);
  res.send({
    contractAddress: tx,
    message: "successfully accessed",
    status: "success",
  });
});
app.get("/contract/:contractID", async (req, res) => {
  // console.log(req.params);
  let { contractID } = req.params;
  contractID = Number(contractID);
  try {
    // console.log("hello");
    const tx = await farmingFactory.getDetails(contractID);
    // console.log(typeof tx);
    // console.log("hello3");
    // console.log(tx);
    res.send({
      result: JSON.parse(
        JSON.stringify(tx, (_, v) => (typeof v === "bigint" ? v.toString() : v))
      ),
      status: "success",
      message: "data successfully fetched",
    });
  } catch (err) {
    // console.log(err);
    res.status(500).send({
      message: err,
      status: "failed",
    });
  }
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
