import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { OPTION_TRADING_API_REST_URL } from "@/config/constants";
import { useClientStore } from "@/stores/clientStore";
import { useToastStore } from "@/stores/toastStore";

export const LoginPage: React.FC = () => {
    const { toast } = useToastStore();
    const [accountId, setAccountId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { setToken } = useClientStore();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post(
                `${OPTION_TRADING_API_REST_URL}/login`,
                {
                    account_id: accountId,
                    password,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json, text/plain, */*",
                    },
                }
            );

            const { token } = response.data;
            localStorage.setItem("loginToken", token);
            setToken(token);
            navigate("/trade");
        } catch (err) {
            toast({
                content: err instanceof Error ? err.message : "Server failed to Login",
                variant: "error",
            });
            setError("Soemthing went wrong! Please try again.");
        }
    };

    const handleCreateAccount = () => {
        window.location.href = `${OPTION_TRADING_API_REST_URL}/`;
    };

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 px-4 sm:px-6 md:px-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Log in to your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="rounded-md space-y-4 mx-2">
                        <div className="relative">
                            <label htmlFor="account-id" className="sr-only">
                                Account ID
                            </label>
                            <input
                                id="account-id"
                                name="account-id"
                                type="text"
                                required
                                className="appearance-none block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 sm:text-sm"
                                placeholder="Account ID"
                                value={accountId}
                                onChange={(e) => setAccountId(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                    <div className="flex gap-4 mx-2">
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            Log in
                        </button>
                        <button
                            type="button"
                            onClick={handleCreateAccount}
                            className="group relative w-full flex justify-center py-2 px-4 border border-primary text-sm font-medium rounded-md text-primary bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            Create Account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
