import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET;

app.use(bodyParser.urlencoded({extended: true}));

app.post("/api/v1/payments", async (req, res) => {
  try {
    const {name, email, amount} = req.body;
    if (!name || !email || !amount) {
      return res
        .status(400)
        .json({error: "Inputs should be name, email, amount"});
    }

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount,
        first_name: name,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({status: "success", data: response.data});
  } catch (error) {
    res.status(500).json({
      error: error.response ? error.response.data : "Internal Server Error",
    });
  }
});

app.get("/api/v1/payments/:id", async (req, res) => {
  try {
    const {id} = req.params;
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${id}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
        },
      }
    );

    res.json({status: "success", data: response.data});
  } catch (error) {
    res.status(500).json({
      error: error.response ? error.response.data : "Internal Server Error",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
