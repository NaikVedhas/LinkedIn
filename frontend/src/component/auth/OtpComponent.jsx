import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

const OtpComponent = ({id}) => {
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes = 120 seconds
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [isResendEnabled, setIsResendEnabled] = useState(false);

  const queryClient = useQueryClient();
  const inputRefs = useRef([]);

  const {mutate:verifyOTP} = useMutation({
    mutationFn:async ()=>{
      const res = await axiosInstance.post('/auth/signup2',{id,otp:otp.join("")});//Combine the digits into a single string
    },
    onSuccess: ()=>{
      toast.success("Account created successfully")
      setTimeout(() => {
        toast.success("Check your email to complete profile");
      }, 3000);

      queryClient.invalidateQueries({queryKey:["authUser"]}); //so basically this will refetch the authUser and as we have logged in now we will be redirected to home page without refreshing just like react context
    },
    onError:  (err)=>{
      toast.error(err.response.data.message || "Something went wrong")
    }
  })


  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer); // Cleanup the timer
    } else {
      setIsResendEnabled(true);
    }
  }, [timeLeft]);

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
    setTimeLeft(120); // Reset timer
    setIsResendEnabled(false); // Disable resend button
    // Add logic to resend the OTP here
    console.log("Resending OTP...");
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
          Verify OTP
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Enter the OTP sent to your email. The OTP is valid for 2 minutes only.
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
