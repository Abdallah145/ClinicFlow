import React, { useState, useRef } from 'react';
import axios from 'axios';

const OtpModal = ({ email, onVerified, onClose }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const inputRefs = useRef([]);

    const handleChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input box
        if (value !== '' && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleVerify = async () => {
        const fullCode = otp.join('');
        if (fullCode.length < 6) return setErrorMsg('Please enter all 6 digits');

        setLoading(true);
        setErrorMsg('');
        try {
            // Points to your backend running on localhost:5000
            await axios.post('http://localhost:5000/api/verify-otp', {
                email,
                code: fullCode,
            });
            onVerified(); // Runs your login / redirect logic
        } catch (err) {
            setErrorMsg(err.response?.data?.error || 'Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full text-center relative border border-gray-100">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold"
                >
                    ✕
                </button>

                <h3 className="text-2xl font-bold text-gray-800">Enter Security Code</h3>
                <p className="text-sm text-gray-500 mt-2">
                    We sent a 6-digit OTP code to <span className="font-semibold text-gray-700">{email}</span>
                </p>

                {errorMsg && (
                    <div className="mt-4 p-2 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                        {errorMsg}
                    </div>
                )}

                {/* 6-Digit Auto-Focus Box Inputs */}
                <div className="flex justify-center gap-2 my-6">
                    {otp.map((digit, idx) => (
                        <input
                            key={idx}
                            ref={(el) => (inputRefs.current[idx] = el)}
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleChange(idx, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(idx, e)}
                            className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all text-gray-800"
                        />
                    ))}
                </div>

                <button
                    onClick={handleVerify}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold shadow-md transition disabled:opacity-50"
                >
                    {loading ? 'Verifying Code...' : 'Verify & Continue'}
                </button>
            </div>
        </div>
    );
};

export default OtpModal;