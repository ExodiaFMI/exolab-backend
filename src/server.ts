import app from './app';
import AppDataSource from './config/database';

const PORT = process.env.PORT;


AppDataSource.initialize()
  .then(() => {
    console.log('✅ Database connected successfully');
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err);
  });


app.listen(PORT, () => {
  console.log(`✅ Server is running on PORT:${PORT}`);
});
