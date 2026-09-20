require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "admin@smartwaste.com";
    const password = "Admin@12345";

    const existing = await User.findOne({ email });

    if (existing) {
      existing.role = "admin";
      existing.password = await bcrypt.hash(password, 10);
      await existing.save();

      console.log("Existing user converted to admin.");
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      await User.create({
        name: "Smart Waste Admin",
        email,
        password: hashedPassword,
        role: "admin",
      });

      console.log("Admin account created successfully.");
    }

    console.log("Email:", email);
    console.log("Password:", password);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

createAdmin();
