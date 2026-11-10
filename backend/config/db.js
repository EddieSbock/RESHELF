import mongoose from 'mongoose';

export const connectDB = async () => {
  const dbUri = process.env['db-uri'] || process.env.DB_URI;

  if (!dbUri) {
    console.error('Variabile d\'ambiente db-uri / DB_URI mancante');
    return;
  }

  try {
    await mongoose.connect(dbUri);
    console.log('Connessione avvenuta con mongoose');
  } catch (error) {
    console.error('Errore di connessione al db:', error.message);
  }
};
