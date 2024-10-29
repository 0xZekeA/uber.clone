import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import axios from 'axios';
import bodyParser from 'body-parser';

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

interface TransactionBody {
  txRef: string;
  amount: number;
  status: string;
  userId: number;
}

interface FlutterwaveWebhookBody {
  data: {
    tx_ref: string;
    status: string;
  };
}

app.post('/api/transaction', async (req: Request, res: Response) => {
  const { txRef, amount, status, userId } = req.body as TransactionBody;

  console.log(
    `Transaction received: ${txRef}, Amount: ${amount}, Status: ${status}, User ID: ${userId}`
  );

  res.status(200).json({
    success: true,
    message: 'Transaction data received, waiting for verification',
  });
});

app.post('/webhook/flutterwave', async (req: Request, res: Response) => {
  const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;

  if (!FLUTTERWAVE_SECRET_KEY) {
    res.status(500).send('Flutterwave secret key not set');
    return;
  }

  const { tx_ref, status } = req.body.data;

  if (status === 'successful') {
    try {
      const verificationUrl = `https://api.flutterwave.com/v3/transactions/${tx_ref}/verify`;

      const response = await axios.get(verificationUrl, {
        headers: {
          Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
        },
      });

      if (response.data.status === 'success') {
        const client = await pool.connect();
        try {
          const checkResult = await client.query(
            'SELECT * FROM transactions WHERE tx_ref = $1',
            [tx_ref]
          );

          if (checkResult.rows.length > 0) {
            res.status(200).send('Transaction already exists');
            return;
          }

          await client.query(
            'INSERT INTO transactions (tx_ref, amount, status, user_id) VALUES ($1, $2, $3, $4)',
            [
              tx_ref,
              response.data.data.amount,
              status,
              response.data.data.customer.id,
            ]
          );

          res.status(200).send('Payment verified and recorded successfully');
          return;
        } finally {
          client.release();
        }
      } else {
        res.status(400).send('Payment verification failed');
        return;
      }
    } catch (error) {
      console.error('Verification error:', error);
      res.status(500).send('Error verifying payment');
      return;
    }
  } else {
    res.status(400).send('Payment not successful');
    return;
  }
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(4000, () => {
  console.log('Server running on port 4000');
});
