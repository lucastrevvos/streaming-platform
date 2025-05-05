import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../index";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

let TEST_EMAIL: string;
const TEST_PASSWORD = "123456";

describe("Auth Endpoints", () => {
  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: TEST_EMAIL } });
  });
  it("should register a new user", async () => {
    const newEmail = `user_${Date.now()}@email.com`;
    const res = await request(app).post("/auth/register").send({
      email: newEmail,
      password: TEST_PASSWORD,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("userId");

    TEST_EMAIL = newEmail;
  });

  it("should login and return token", async () => {
    const res = await request(app).post("/auth/login").send({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should fail login with wrong password", async () => {
    const res = await request(app).post("/auth/login").send({
      email: TEST_EMAIL,
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  it("should fail login with non-existent email", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "nonexistent@email.com",
      password: TEST_PASSWORD,
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error");
  });
});
