import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { loginWithGoogle } from "./api/authApi";
import { loginUser } from "./api/userApi";
import toast from "react-hot-toast";
import { loginWithGithub } from "./api/loginWithGoogleApi";
// import ParticlesBackground from "./components/ParticlesBackground";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [serverError, setServerError] = useState("");
  // const isHeavyUpload = false; // Placeholder, replace with actual logic if needed
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
        toast.error(data.error || "Login failed");
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
      {/* <ParticlesBackground enabled={!isHeavyUpload}/> */}
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

          {/* login with github logic*/}
       <div className="flex justify-center mt-4" onClick={loginWithGithub}> 
          <button
  className="cursor-pointer text-zinc-200 flex gap-2 items-center bg-black px-4 py-2 rounded-lg font-medium text-sm hover:bg-[#111] transition-all ease-in duration-200"
>
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 fill-zinc-200"
  >
    <path
      d="M10.9,2.1c-4.6,0.5-8.3,4.2-8.8,8.7c-0.6,5,2.5,9.3,6.9,10.7v-2.3c0,0-0.4,0.1-0.9,0.1c-1.4,0-2-1.2-2.1-1.9 c-0.1-0.4-0.3-0.7-0.6-1C5.1,16.3,5,16.3,5,16.2C5,16,5.3,16,5.4,16c0.6,0,1.1,0.7,1.3,1c0.5,0.8,1.1,1,1.4,1c0.4,0,0.7-0.1,0.9-0.2 c0.1-0.7,0.4-1.4,1-1.8c-2.3-0.5-4-1.8-4-4c0-1.1,0.5-2.2,1.2-3C7.1,8.8,7,8.3,7,7.6C7,7.2,7,6.6,7.3,6c0,0,1.4,0,2.8,1.3 C10.6,7.1,11.3,7,12,7s1.4,0.1,2,0.3C15.3,6,16.8,6,16.8,6C17,6.6,17,7.2,17,7.6c0,0.8-0.1,1.2-0.2,1.4c0.7,0.8,1.2,1.8,1.2,3 c0,2.2-1.7,3.5-4,4c0.6,0.5,1,1.4,1,2.3v3.3c4.1-1.3,7-5.1,7-9.5C22,6.1,16.9,1.4,10.9,2.1z"
    ></path>
  </svg>
  Login with GitHub
</button>
       </div>

          <p className="text-center text-xs text-gray-500 mt-6">
            Cookies must be enabled for Google login
          </p>
        </div>

        <p className="text-center text-gray-400 text-sm mt-8">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-white font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;