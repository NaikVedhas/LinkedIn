import { Link } from "react-router-dom";
import SignupForm from "../../component/auth/SignupForm";
import OtpComponent from "../../component/auth/OtpComponent"
import { useState } from "react";
const SignUpPage = () => {
	
	const [showOTP, setShowOTP] = useState(false); // Step 1: Signup Form, Step 2: OTP
	const [tempUserId, setTempUserId] = useState(null); // To store the user ID from the signup form response

	const handleSignupSuccess = (id) => {
		setTempUserId(id); 
		setShowOTP(true); 
	};

	return (
		<div className='min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
			<div className='sm:mx-auto sm:w-full sm:max-w-md'>
				<img className='mx-auto h-36 w-auto' src='/logo.svg' alt='LinkedIn' />
				<h2 className='text-center text-3xl font-extrabold text-gray-900'>
					{!showOTP?
					<>
					Make the most of your professional life
					</>
					:
					<>
					OTP verification
					</>
					}
				</h2>
			</div>
			<div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md shadow-md'>
				<div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
					
					{!showOTP ? 
					<SignupForm navigateToOTP={handleSignupSuccess}/>
					:
					<OtpComponent id={tempUserId}/>
					}

					<div className='mt-6'>
						<div className='relative'>
							<div className='absolute inset-0 flex items-center'>
								<div className='w-full border-t border-gray-300'></div>
							</div>
							<div className='relative flex justify-center text-sm'>
								<span className='px-2 bg-white text-gray-500'>Already on LinkedIn?</span>
							</div>
						</div>
						<div className='mt-6'>
							<Link
								to='/login'
								className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-gray-50'
							>
								Sign in
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default SignUpPage;