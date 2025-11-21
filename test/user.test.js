import request from "supertest";
import app from "../server.js";


beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
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
