import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Alert from "../ui/swal";

const ProtectedRoute = ({ children }) => {
    const { user } = useSelector(store => store.auth);

    const navigate = useNavigate();

    useEffect(() => {
        console.log(user)
        if (user === null || user.role !== 'recruiter' && user.role !== 'admin') {
            navigate("/");
        }
       
    }, []);
    return (
        <>
            {children}
        </>
    )
};
export default ProtectedRoute;