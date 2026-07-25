import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Resend } from 'resend';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

dotenv.config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// Initialize Firebase Admin
if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    console.error("\x1b[31m%s\x1b[0m", "ERROR: FIREBASE_SERVICE_ACCOUNT environment variable is missing!");
    console.error("Please generate a private key in the Firebase Console (Project Settings -> Service Accounts),");
    console.error("convert the JSON into a single-line string, and add it to server/.env like this:");
    console.error("FIREBASE_SERVICE_ACCOUNT='{\"type\": \"service_account\", ...}'\n");
    process.exit(1);
}

if (!getApps().length) {
    initializeApp({
        credential: cert(
            JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
        ),
    });
}
const db = getFirestore();
const resend = new Resend(process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY);

// 1. Send 6-Digit OTP Route
app.post('/api/send-otp', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minute lifespan

    try {
        await db.collection('otp_verifications').doc(email).set({
            code: otpCode,
            expiresAt,
            verified: false,
        });

        await resend.emails.send({
            from: 'Healix Security <onboarding@resend.dev>',
            to: email,
            subject: 'Your Healix 6-Digit Verification Code',
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #2563eb;">Healix Healthcare Verification</h2>
          <p>Your 6-digit security code is:</p>
          <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 5px; border-radius: 8px; color: #1e40af;">
            ${otpCode}
          </div>
          <p style="font-size: 12px; color: #6b7280; margin-top: 15px;">Valid for 5 minutes.</p>
        </div>
      `,
        });

        res.status(200).json({ message: 'OTP sent successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
});

// 2. Verify 6-Digit OTP Route
app.post('/api/verify-otp', async (req, res) => {
    const { email, code } = req.body;

    try {
        const doc = await db.collection('otp_verifications').doc(email).get();
        if (!doc.exists) return res.status(400).json({ error: 'No OTP requested for this email' });

        const data = doc.data();
        if (Date.now() > data.expiresAt) return res.status(400).json({ error: 'OTP expired.' });
        if (data.code !== code) return res.status(400).json({ error: 'Invalid code.' });

        await db.collection('otp_verifications').doc(email).update({ verified: true });
        res.status(200).json({ message: 'Verification successful!' });
    } catch (error) {
        res.status(500).json({ error: 'Verification error' });
    }
});

// Local dev listener
if (process.env.NODE_ENV !== 'production') {
    app.listen(5000, () => console.log('OTP Server running on http://localhost:5000'));
}

export default app;