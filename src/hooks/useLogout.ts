import { useNavigate } from "react-router-dom";
import { useClientStore } from "@/stores/clientStore";

export const useLogout = () => {
    const navigate = useNavigate();
    const { resetState } = useClientStore();

    return () => {
        localStorage.removeItem("loginToken");
        resetState();
        navigate("/");
    };
};
