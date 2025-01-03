import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null; // Không hiển thị modal nếu isOpen là false

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div>{children}</div>

                {/* Footer */}
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>,
        document.body // Gắn modal vào phần tử body của HTML
    );
};

export default Modal;
