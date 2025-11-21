import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import app from "./app.js";



(async () => {
  try {

    const PORT = process.env.PORT || 4000;
    const MONGO_URI = process.env.MONGO_URL || 'mongodb+srv://heroviredsaurabh1325_db_user:a0FwrpO4DbJL2ZGp@heroviredsaurabhcluster.o7yzksc.mongodb.net/User_Db';
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("DB Connection Failed:", err);
    process.exit(1);
  }
})();
