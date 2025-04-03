import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: ""
    })
    const { signup, isSigningUp, login, isLoggingIn } = useAuthStore();

    const signupValidation = () => {
        if (!formData.fullName.trim() && !isLogin) {
            return toast.error("Full name is required")
        }
        if (!formData.email.trim()) {
            return toast.error("Email is required")
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            return toast.error("Invalid email format");
        }
        if (!formData.password.trim()) {
            return toast.error("Password is required")
        }
        if (formData.password.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }
        return true
    }
    const handleSignup = () => {
        const success = signupValidation();
        if (success === true) {
            signup(formData)
        }
    }


    const loginValidation = () => {
        if (!formData.email.trim()) {
            return toast.error("Email is required")
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            return toast.error("Invalid email format");
        }
        if (!formData.password.trim()) {
            return toast.error("Password is required")
        }
        if (formData.password.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }
        return true
    }
    const handleLogin = () => {
        const success = signupValidation();
        if (success === true) {
            login(formData)
        }
    }


    return (
        <div className="flex items-center justify-center min-h-screen text-white">
            <div className="relative w-[19rem] xxs:w-96  bg-base-300 shadow-[0px_10px_30px_rgba(0,0,0,0.7)] rounded-2xl p-6   overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-gray-700 before:via-gray-800 before:to-gray-900 before:opacity-40 before:rounded-2xl">
                <div className="absolute -top-12 -left-12 w-32 h-32 bg-blue-500 opacity-20 blur-2xl"></div>
                <div className="absolute top-12 right-12 w-24 h-24 bg-pink-500 opacity-20 blur-2xl"></div>
                <h2 className="relative text-center text-2xl font-extrabold text-gray-100 drop-shadow-lg">
                    {isLogin ? "Login" : "Sign Up"}
                </h2>
                <div className="relative mt-6 space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-gray-300" htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                autoComplete="off"
                                placeholder="full name"
                                value={formData.fullName}
                                onChange={(e) => { setFormData({ ...formData, fullName: e.target.value }) }}
                                className="w-full mt-1 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[inset_2px_2px_6px_rgba(255,255,255,0.1)]" />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-300" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            autoComplete="off"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => { setFormData({ ...formData, email: e.target.value }) }}
                            className="w-full mt-1 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[inset_2px_2px_6px_rgba(255,255,255,0.1)]" />
                    </div>
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-300" htmlFor="pass">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="pass"
                            autoComplete="off"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => { setFormData({ ...formData, password: e.target.value }) }}
                            className="w-full mt-1 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[inset_2px_2px_6px_rgba(255,255,255,0.1)]"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-10 right-3 text-gray-400 hover:text-gray-200"
                        >
                            {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Auth Buttons */}
                    {isLogin ?
                        <button
                            onClick={handleLogin}
                            disabled={isLoggingIn}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white font-semibold py-3 rounded-lg shadow-[0px_4px_10px_rgba(0,0,0,0.4)] transform active:scale-95 transition">
                            {isLoggingIn ? "Logging In..." : "Log In"}
                        </button>
                        : <button
                            onClick={handleSignup}
                            disabled={isSigningUp}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white font-semibold py-3 rounded-lg shadow-[0px_4px_10px_rgba(0,0,0,0.4)] transform active:scale-95 transition">
                            {isSigningUp ? "Signing Up..." : "Sign Up"}
                        </button>
                    }
                </div>
                <p className="relative mt-4 text-center text-sm text-gray-300">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setFormData({ fullName: "", email: "", password: "" }); // Reset form data
                        }}
                        className="text-blue-400 hover:underline ml-1 "
                    >
                        {isLogin ? "Sign Up" : "Login"}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;