import request from "supertest"
import app from "../src/app"

describe("Test healtcheck endpoint", () => {
  test("GET /", async () => {
    const res = await request(app).get("/")
    expect(res.statusCode).toEqual(200)
  });
});