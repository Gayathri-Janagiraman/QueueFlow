// import dns from "dns";
// import mongoose from "mongoose";

// dns.setServers(["8.8.8.8", "8.8.4.4"]);

// const connectDB = async () => {
//   try {
//     console.log("DNS Servers:", dns.getServers());

//     const conn = await mongoose.connect(process.env.MONGO_URI);

//     console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error("❌ MongoDB Connection Failed");
//     console.error(error);
//     process.exit(1);
//   }
// };

// export default connectDB;


import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;