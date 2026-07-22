import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'motion/react';
import axios from 'axios';
import { serverUrl } from '../config';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function Pricing() {
    const navigate = useNavigate();
    const [selectedPlan, setSelectedPlan] = useState(1);
    const [loadingPlan, setLoadingPlan] = useState(null);
    const dispatch = useDispatch();

    const plans = [
        {
            id: 1,
            name: "Starter",
            price: "Free",
            credits: 100,
            shortDescription:
                "Perfect for your first mock interviews. Because confidence doesn't install itself.",
            features: [
                "100 AI Interview Credits",
                "Role-Based Mock Interviews",
                "Instant AI Feedback",
                "Performance Score & Analytics",
                "Interview History",
                "Basic Resume Analysis",
                "Email Support",
            ],
            default: true,
        },
        {
            id: 2,
            name: "Pro",
            price: "₹99",
            credits: 250,
            shortDescription:
                "For people who want recruiters to remember their answers... not their awkward silence.",
            features: [
                "250 AI Interview Credits",
                "Everything in Starter",
                "Advanced AI Feedback",
                "Detailed Strength & Weakness Analysis",
                "Unlimited Resume Uploads",
                "Priority AI Processing",
                "Premium Interview Reports (PDF)",
                "Priority Support",
            ],
        },
        {
            id: 3,
            name: "Legend (like ME)",
            price: "₹199",
            credits: 600,
            shortDescription:
                "Built for future offer letters. Warning: recruiters may start liking you too much.",
            features: [
                "600 AI Interview Credits",
                "Everything in Pro",
                "Unlimited Practice Sessions",
                "Company-Specific Interview Prep",
                "Advanced Performance Dashboard",
                "AI Career Insights",
                "Early Access to New Features",
                "VIP Priority Support",
            ],
            badge: "Best value",
        },
    ];

    const verifyPayment = async (response, plan) => {
        try {
            const result = await axios.post(
                `${serverUrl}/api/payment/verify`,
                {
                    paymentId: response.razorpay_payment_id,
                    orderId: response.razorpay_order_id,
                    signature: response.razorpay_signature,
                },
                { withCredentials: true }
            );
            alert(`Payment successful! ${plan.credits} credits added.`);
            navigate('/');
        } catch (error) {
            console.error("Verification error:", error);
            alert(error.response?.data?.message || "Payment verification failed");
        }
    };

    const handlePayment = async (plan) => {
        try {
            setLoadingPlan(plan.id);
            const amount = Number(plan.id) === 2 ? 99 : Number(plan.id) === 3 ? 199 : 0;

            const result = await axios.post(
                `${serverUrl}/api/payment/order`,
                {
                    planId: plan.id,
                    amount: amount,
                    credits: plan.credits,
                },
                { withCredentials: true }
            );

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: result.data.amount,
                currency: result.data.currency,
                name: "Legend AI Interview",
                description: `Purchase ${plan.name} Plan (${plan.credits} Credits)`,
                order_id: result.data.id,
                handler: async function (response) {
                    try {
                        const verifypay = await axios.post(
                            `${serverUrl}/api/payment/verify`,
                            {
                                paymentId: response.razorpay_payment_id,
                                orderId: response.razorpay_order_id,
                                signature: response.razorpay_signature,
                            },
                            { withCredentials: true }
                        );
                        dispatch(setUserData(verifypay.data.user));
                        alert("Payment Successful! Credits added successfully ");
                        navigate("/");
                    } catch (err) {
                        console.error("Verify error:", err);
                        alert(err.response?.data?.message || "Payment verification failed. Contact support.");
                    }
                },
                notes: {
                    plan: plan.name,
                    credits: plan.credits,
                },
                theme: {
                    color: "#10b981",
                },
            };

            if (typeof window.Razorpay !== 'undefined') {
                const razorpay = new window.Razorpay(options);
                razorpay.on("payment.failed", function () {
                    alert("Payment failed. Please try again.");
                });
                razorpay.open();
            } else {
                alert("Razorpay SDK failed to load. Check your internet connection.");
            }
        } catch (error) {
            console.error("Payment order error:", error);
            alert(error.response?.data?.message || "Failed to initiate payment");
        } finally {
            setLoadingPlan(null);
        }
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-emerald-100 py-16 px-6'>
            <div className='max-w-6xl mx-auto mb-14 flex items-center gap-4'>
                <button
                    onClick={() => navigate("/")}
                    className='p-3 rounded-full bg-white shadow hover:shadow-md transition'
                >
                    <FaArrowLeft className='text-gray-600' />
                </button>

                <div className='text-center w-full pr-12'>
                    <h1 className='text-3xl sm:text-4xl font-bold text-gray-800'>Choose Your Plan</h1>
                    <p className='text-gray-500 mt-2 text-base sm:text-lg'>The only difficult choice before your next interview</p>
                </div>
            </div>

            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto'>
                {plans.map((plan) => {
                    const isSelected = selectedPlan === plan.id;
                    return (
                        <motion.div
                            key={plan.id}
                            whileHover={!plan.default ? { scale: 1.02 } : undefined}
                            onClick={() => setSelectedPlan(plan.id)}
                            className={`relative rounded-3xl p-8 transition-all duration-300 border flex flex-col justify-between ${
                                isSelected
                                    ? "border-emerald-600 shadow-2xl bg-white ring-2 ring-emerald-500"
                                    : "border-gray-200 bg-white shadow-md hover:shadow-xl"
                            } cursor-pointer`}
                        >
                            <div>
                                {plan.badge && (
                                    <div className='absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow'>
                                        {plan.badge}
                                    </div>
                                )}

                                {plan.default && !plan.badge && (
                                    <div className='absolute top-4 right-4 bg-gray-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow'>
                                        Default
                                    </div>
                                )}

                                <h3 className='text-2xl font-bold text-gray-800'>{plan.name}</h3>

                                <div className='mt-4 flex items-baseline gap-2'>
                                    <span className='text-4xl font-extrabold text-emerald-600'>{plan.price}</span>
                                    <span className='text-gray-500 text-sm font-medium'>/ {plan.credits} Credits</span>
                                </div>

                                <p className='text-gray-600 mt-4 text-sm leading-relaxed'>{plan.shortDescription}</p>

                                <div className='mt-6 space-y-3 text-left border-t border-gray-100 pt-6'>
                                    {plan.features.map((feature, i) => (
                                        <div key={i} className='flex items-center gap-3'>
                                            <FaCheckCircle className='text-emerald-500 text-sm flex-shrink-0' />
                                            <span className='text-gray-700 text-sm'>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {!plan.default ? (
                                <button
                                    disabled={loadingPlan === plan.id}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!isSelected) {
                                            setSelectedPlan(plan.id);
                                        } else {
                                            handlePayment(plan);
                                        }
                                    }}
                                    className={`mt-8 w-full py-3 rounded-xl font-semibold transition-all ${
                                        isSelected
                                            ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    {loadingPlan === plan.id
                                        ? "Processing..."
                                        : isSelected
                                        ? "Proceed to Pay"
                                        : "Select Plan"}
                                </button>
                            ) : (
                                <div className="mt-8 w-full py-3 rounded-xl font-semibold text-center bg-gray-100 text-gray-500">
                                    Current Plan
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

export default Pricing;
