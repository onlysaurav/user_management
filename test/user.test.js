import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";



beforeAll(async () => {
  const mongoUri = process.env.MONGO_URL || 'mongodb+srv://heroviredsaurabh1325_db_user:a0FwrpO4DbJL2ZGp@heroviredsaurabhcluster.o7yzksc.mongodb.net/User_Db';
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("User API Tests", () => {

    it("should return 200 for health check", async () => {
        const res = await request(app).get("/api/health");
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("API Working");
    });

});
