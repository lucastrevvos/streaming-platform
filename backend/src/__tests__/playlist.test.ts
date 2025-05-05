import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../index";
import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret";

let TEST_EMAIL: string;
const TEST_PASSWORD = "123456";

describe("Playlist Endpoints - Error Handling", () => {
  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: TEST_EMAIL } });
    await prisma.$disconnect();
  });

  it("should return 404 if playlist does not exist", async () => {
    const newEmail = `user_${Date.now()}@email.com`;

    const newUser = await request(app).post("/auth/register").send({
      email: newEmail,
      password: TEST_PASSWORD,
    });
    const token = jwt.sign(
      { id: newUser.body.userId, email: TEST_EMAIL },
      JWT_SECRET
    );

    const res = await request(app)
      .get("/playlists/9999")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Playlist não encontrada");

    TEST_EMAIL = newEmail;
  });
});
