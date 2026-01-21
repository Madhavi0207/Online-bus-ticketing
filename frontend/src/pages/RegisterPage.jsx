import React from "react";
import { Link } from "react-router-dom";
import RegisterForm from "../components/auth/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Join LuxuryRide</h2>
          <p className="mt-2 text-gray-600">
            Create your account for premium travel experience
          </p>
        </div> */}

        <div className="mt-8 bg-white py-8 px-4 shadow-xl rounded-xl sm:px-10">
          <RegisterForm />
        </div>

        {/* <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Sign in here
            </Link>
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default RegisterPage;
