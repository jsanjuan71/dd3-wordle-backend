import request from "supertest"
import app from "../src/app"
import { StatusCodes } from "http-status-codes";

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6Ikp1bGlvIFNhbmp1YW4iLCJpYXQiOjE2Nzc4ODk2MzJ9.Q1ZzRMCuzpQVlX4jw9vUatnxpjP3caZvMcjTOC-JcQU'

describe("Test healtcheck endpoint", () => {

  test("GET / without authorization", async () => {
    const res = await request(app)
      .get("/")

    expect(res.statusCode).toEqual( StatusCodes.FORBIDDEN )
  });

  test("GET / with authorization", async() => {
    const res = await request(app)
      .get("/")
      .set({'Authorization' : `Bearer ${token}`})

    expect(res.statusCode).toBe( StatusCodes.OK )
  });
});