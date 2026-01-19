import React, { useEffect } from "react";
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
  type = "default",
  footer,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  danger = false,
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-7xl",
  };

  const typeIcons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
    default: null,
  };

  const typeColors = {
    success: "text-green-600",
    error: "text-red-600",
    warning: "text-yellow-600",
    info: "text-blue-600",
    default: "",
  };

  const Icon = typeIcons[type];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div
            className={`bg-white rounded-xl shadow-2xl w-full ${sizeClasses[size]} transform transition-all`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {Icon && <Icon className={`h-6 w-6 ${typeColors[type]}`} />}
                  <h3 className="text-lg font-semibold text-gray-900">
                    {title}
                  </h3>
                </div>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-4">{children}</div>

            {/* Footer */}
            {footer !== null && (
              <div className="px-6 py-4 border-t bg-gray-50 rounded-b-xl">
                {footer || (
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                      disabled={isLoading}
                    >
                      {cancelText}
                    </button>
                    {onConfirm && (
                      <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`
                          px-4 py-2 rounded-lg text-white font-medium
                          ${
                            danger
                              ? "bg-red-600 hover:bg-red-700"
                              : "bg-primary-600 hover:bg-primary-700"
                          }
                          disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Processing...</span>
                          </div>
                        ) : (
                          confirmText
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// Specific Modal Types
export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  danger = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      type={danger ? "warning" : "default"}
      onConfirm={onConfirm}
      confirmText={confirmText}
      cancelText={cancelText}
      isLoading={isLoading}
      danger={danger}
    >
      <div className="text-gray-600">{message}</div>
    </Modal>
  );
};

export const SuccessModal = ({ isOpen, onClose, title, message }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      type="success"
      showCloseButton={false}
      footer={
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            OK
          </button>
        </div>
      }
    >
      <div className="text-center py-4">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <p className="text-gray-600">{message}</p>
      </div>
    </Modal>
  );
};

export const ErrorModal = ({ isOpen, onClose, title, message, error }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      type="error"
      footer={
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Close
          </button>
        </div>
      }
    >
      <div className="text-center py-4">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">{message}</p>
        {error && (
          <div className="mt-4 p-3 bg-red-50 rounded-lg text-left">
            <code className="text-sm text-red-700">{error}</code>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default Modal;
