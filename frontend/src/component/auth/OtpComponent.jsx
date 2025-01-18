import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

const OtpComponent = ({setShowOTP}) => {

  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes 
  const [otp, setOtp] = useState(Array(6).fill(""));   // OTP array of 6 digits
  const [isResendEnabled, setIsResendEnabled] = useState(false); // Flag for enabling resend button
  const [id, setId] = useState(null);
  const [resendCounter,setResendCounter] = useState(0)   //  Track resend actions. Actually when we resend otp then we wantthe frontend timer to reset and start now we are resetting but the start logic is in useeffect so to run that we useethis
  const queryClient = useQueryClient();
  const inputRefs = useRef([]); // Refs for OTP input fields

  const { mutate: verifyOTP } = useMutation({
    mutationFn: async () => await axiosInstance.post("/auth/signup2", { id, otp: otp.join("") }), // Combine the digits into a single string

    onSuccess: () => {
      toast.success("Account created successfully");
      setTimeout(() => {
        toast.success("Check your email to complete profile");
      }, 3000);

      localStorage.clear(); 
      queryClient.invalidateQueries({ queryKey: ["authUser"] }); // Refetch authUser and redirect to home page
    },
    onError: (err) => {
      if(err?.response?.data?.message === "Validation timed out. Please signup again"){
        
        localStorage.clear(); // Clear all temp user data
        setShowOTP(false); // Redirect to signupform page if tempuser expired 
		    toast.error("Credentials expired");
      }
      else toast.error(err?.response?.data?.message || "Something went wrong");
    }
  });


  const {mutate:resendOTP} =useMutation({
    mutationFn: async ()=> await axiosInstance.post('/auth/signup2/resendotp',{id}),
    onSuccess: ()=>{
      toast.success("OTP successfully sent");
    },
    onError:async (err)=>{
      if(err?.response?.data?.message === "Validation timed out. Please signup again"){
        localStorage.clear(); 
        setShowOTP(false); 
		    toast.error("Credentials expired");
      }
      else{
       toast.error(err.response.data.message || "Something went wrong please try again later")
      }
  }
  })
 
  useEffect(() => {

    
    const storedId = localStorage.getItem('otpId');
    if (storedId) {
      setId(storedId); // Set the id state if it exists in localStorage
    }

    // Countdown timer
    const otpExpirationTime = localStorage.getItem("otpExpirationTime");

    if (otpExpirationTime) {
      const expirationTime = parseInt(otpExpirationTime, 10);
      const currentTime = Date.now();
      const timeLeft = expirationTime - currentTime;

      if (timeLeft > 0) {
        setTimeLeft(Math.floor(timeLeft / 1000)); // Set remaining time in seconds
        const timer = setInterval(() => {
          setTimeLeft((prevTime) => {
            if (prevTime <= 1) {
              clearInterval(timer);
              setIsResendEnabled(true); // Enable resend when time is up
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);
        return () => clearInterval(timer); // Cleanup interval
      } else {
        setIsResendEnabled(true); // OTP expired, enable resend button
        setTimeLeft(0);
      }
    } else {
      // If no expiration time exists, set a new timer and save it in localStorage
      const newExpirationTime = Date.now() + 120 * 1000; // 2 minutes from now
      localStorage.setItem("otpExpirationTime", newExpirationTime.toString());
      setTimeLeft(120); // Start from 120 seconds
    }

     // Cleanup interval on component unmount or when timeLeft changes
  }, [resendCounter]);

  const handleOtpChange = (e, index) => {
    const value = e.target.value.slice(0, 1); // Allow only one character
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to the next input
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move focus to the previous input on backspace if the current input is empty
      inputRefs.current[index - 1].focus();
    }
  };

  const handleResendOtp = () => {
    resendOTP();
    setTimeLeft(120); // Reset timer
    setIsResendEnabled(false); // Disable resend button
    setResendCounter((prev) => prev + 1); // Increment resend counter ie just change resendCounter
    // Update expiration time in localStorage when OTP is resent
    const newExpirationTime = Date.now() + 120 * 1000; // 2 minutes from now
    localStorage.setItem("otpExpirationTime", newExpirationTime.toString());
  };

  const handleVerifyOtp = () => {
    if (otp.join("").length === 6) {
      verifyOTP();
    } else {
      toast.error("OTP must be 6 characters long");
    }
  };

  // Format time as MM:SS
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white p-4">
      <div className="bg-white shadow-2xl rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
          Verify OTP
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Enter the OTP sent to your email. 
          <p>
          The OTP is valid for 2 minutes only!
          </p>
        </p>
        <div className="flex justify-center gap-2 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              value={digit}
              onChange={(e) => handleOtpChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(ref) => (inputRefs.current[index] = ref)}
              className="w-11 h-12 text-center border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={1}
            />
          ))}
        </div>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleResendOtp}
            disabled={!isResendEnabled}
            className={`${
              isResendEnabled
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-300 cursor-not-allowed"
            } text-white font-medium py-2 px-4 rounded-md transition duration-200`}
          >
            Resend OTP
          </button>
          <span className="text-gray-600">
            Time left:{" "}
            <span className="font-medium text-gray-900">
              {formatTime(timeLeft)}
            </span>
          </span>
        </div>
        <button
          onClick={handleVerifyOtp}
          disabled={isResendEnabled}
          className={`${
            isResendEnabled
              ? "bg-gray-300 w-full cursor-not-allowed "
              : " bg-primary  w-full hover:bg-blue-600 "
          } text-white font-medium py-2 px-4 rounded-md transition duration-200`}
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
};

export default OtpComponent;
