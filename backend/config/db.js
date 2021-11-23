import mongoose from 'mongoose';


const connectDB = async () => {
  try{
    console.log(process.env.MONGO_URI)
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true
    });
    // console.log(`Mongodb Connected: ${connection.connection.host}`);
    console.log(`Mongodb Connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

export default connectDB;
