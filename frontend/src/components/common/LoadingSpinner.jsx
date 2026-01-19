import React from "react";
import { Oval } from "react-loader-spinner";

const LoadingSpinner = ({
  size = 40,
  color = "#3b82f6",
  text = "Loading...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-50">
      <Oval
        height={size}
        width={size}
        color={color}
        secondaryColor="#dbeafe"
        strokeWidth={4}
        strokeWidthSecondary={4}
      />
      {text && <p className="mt-4 text-gray-600">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
