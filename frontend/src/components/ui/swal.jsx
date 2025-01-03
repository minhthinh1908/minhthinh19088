import Swal from "sweetalert2";

const Alert = {
    success: (message) => {
        Swal.fire({
            icon: "success",
            title: `<h3 style="color: #4CAF50;">Success!</h3>`,
            html: `<p style="color: #000; font-size: 16px;">${message}</p>`,
            timer: 2000,
            showConfirmButton: false,
            background: "#f9f9f9",
            customClass: {
                popup: "swal-custom-popup",
            },
        });
    },
    error: (message) => {
        Swal.fire({
            icon: "error",
            title: `<h3 style="color: #f44336;">Error!</h3>`,
            html: `<p style="color: #000; font-size: 16px;">${message}</p>`,
            background: "#f9f9f9",
            confirmButtonText: "Thử lại",
            confirmButtonColor: "#f44336",
            customClass: {
                popup: "swal-custom-popup",
            },
        });
    },
    warning: (message) => {
        Swal.fire({
            icon: "warning",
            title: `<h3 style="color: #FFC107;">Warning!</h3>`,
            html: `<p style="color: #000; font-size: 16px;">${message}</p>`,
            background: "#fff8e1",
            confirmButtonText: "OK",
            confirmButtonColor: "#FFC107",
            customClass: {
                popup: "swal-custom-popup",
            },
        });
    },
    info: (message) => {
        Swal.fire({
            icon: "info",
            title: `<h3 style="color: #2196F3;">Information</h3>`,
            html: `<p style="color: #000; font-size: 16px;">${message}</p>`,
            background: "#e3f2fd",
            confirmButtonText: "OK",
            confirmButtonColor: "#2196F3",
            customClass: {
                popup: "swal-custom-popup",
            },
        });
    },
};

export default Alert;