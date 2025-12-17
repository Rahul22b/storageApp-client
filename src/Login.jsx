import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { loginWithGoogle } from "./api/authApi";
import { loginUser } from "./api/userApi";
import toast from "react-hot-toast";
import ParticlesBackground from "./components/ParticlesBackground";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [serverError, setServerError] = useState("");
  const isHeavyUpload = false; // Placeholder, replace with actual logic if needed
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (serverError) setServerError("");
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await loginUser(formData);
      
      if (data.error) {
        toast.error(data.error);
        setServerError(data.error);
      } else {
        toast.success("Logged in successfully");
        navigate("/");
      };
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.response?.data?.error || "Something went wrong.");
      setServerError(err.response?.data?.error || "Something went wrong.");
    } 
    finally {
      setIsLoading(false);
    }
  };

  const hasError = Boolean(serverError);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6 relative overflow-hidden">
      <ParticlesBackground enabled={!isHeavyUpload}/>
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">Welcome</h1>
          <p className="text-gray-400">Enter your credentials to continue</p>
        </div>

        <div className="bg-zinc-900 rounded-3xl p-8 shadow-2xl border border-zinc-800">
          <div className="space-y-6">

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3.5 bg-black border ${
                  hasError ? "border-red-500" : "border-zinc-700"
                } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors`}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3.5 bg-black border ${
                  hasError ? "border-red-500" : "border-zinc-700"
                } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors`}
              />
              {serverError && (
                <p className="text-red-500 text-sm mt-2">{serverError}</p>
              )}
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-white text-black py-3.5 rounded-xl font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-zinc-900 text-gray-400">or continue with</span>
            </div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
  onSuccess={async (credentialResponse) => {
    try {
      setIsLoading(true);
      const data = await loginWithGoogle(credentialResponse.credential);
      if (!data.error) navigate("/");
    } catch (err) {
      console.error("Google login failed:", err);
    } finally {
      setIsLoading(false);
    }
  }}
  onError={() => console.log("Login Failed")}
  theme="filled_blue"
  text="continue_with"
  useOneTap
/>
            
          </div>

          <p className="text-center text-xs text-gray-500 mt-6">
            Cookies must be enabled for Google login
          </p>
        </div>

        <p className="text-center text-gray-400 text-sm mt-8">
          Don't have an account?{" "}
          <Link to="/register" className="text-white font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;