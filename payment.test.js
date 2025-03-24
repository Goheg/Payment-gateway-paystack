import request from "supertest";
import app from "./index.js";

describe("Payment API", () => {
  let paymentReference;

  test("should initialize a payment", async () => {
    const response = await request(app).post("/api/v1/payments").send({
      name: "John Doe",
      email: "johndoe@example.com",
      amount: 5000,
    });

    expect(200);

    paymentReference = response.body.data;
  });
  console.log(paymentReference);

  test("should verify payment status", async () => {
    const response = await request(app).get(
      `/api/v1/payments/${paymentReference}`
    );

    expect(200);
  });
});
