import React from "react";

function InfoRow({ icon, label, value }) {
    return (
        <div className="mb-4">
            <p className="text-sm text-black-700 flex items-center mb-3">
                {icon}
                <span className="font-bold text-black-500">{label}</span>
                <span className="font-normal text-black-700 ml-1">{value}</span>
            </p>
            <hr className="mb-3 rounded-full" />
        </div>
    );
}

export default InfoRow;
