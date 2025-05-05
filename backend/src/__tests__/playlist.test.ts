import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../index";
import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret";

let TEST_EMAIL: string;
const TEST_PASSWORD = "123456";
let ID_USER: number;

describe("Playlist Endpoints - Error Handling", () => {
  afterAll(async () => {
    await prisma.playlist.deleteMany();
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
      { id: newUser.body.userId, email: newEmail },
      JWT_SECRET
    );

    const res = await request(app)
      .get("/playlists/9999")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Playlist não encontrada");

    TEST_EMAIL = newEmail;
    ID_USER = newUser.body.userId;
  });

  it("should create a playlist for authenticated user", async () => {
    const token = jwt.sign({ id: ID_USER, email: TEST_EMAIL }, JWT_SECRET);

    const createRes = await request(app)
      .post("/playlists")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Minha playlist" });

    expect(createRes.statusCode).toBe(201);
    expect(createRes.body).toHaveProperty("name", "Minha playlist");
  });

  it("should return all playlists for authenticated user", async () => {
    const token = jwt.sign({ id: ID_USER, email: TEST_EMAIL }, JWT_SECRET);

    const res = await request(app)
      .get("/playlists")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
