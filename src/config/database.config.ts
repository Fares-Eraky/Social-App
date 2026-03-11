import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const maxRetries = 5;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/social-media';

      await mongoose.connect(mongoUri);

      console.log('MongoDB connected successfully');
      return;
    } catch (error) {
      retries++;
      console.error(`MongoDB connection attempt ${retries} failed:`, error);

      if (retries === maxRetries) {
        console.error('Max retries reached. Could not connect to MongoDB');
        throw new Error(`Failed to connect to MongoDB after ${maxRetries} attempts`);
      }

      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});
