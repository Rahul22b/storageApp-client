import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { loginWithGoogle, sendOtp} from "./api/authApi";
import { registerUser } from "./api/userApi";
import toast from "react-hot-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  
  const [serverError, setServerError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  // const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [isSending, setIsSending] = useState(false);
  // const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setServerError("");
      setOtpError("");
      setOtpSent(false);
      setCountdown(0);
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      toast.error("Please enter your email first.");
      setServerError("Please enter your email first."); // Use serverError for input validation too
      return;
    }

    // 1. Clear previous errors before API call
    setServerError("");
    setOtpError("");
    setOtpSent(false); // Make sure the OTP input disappears on a new attempt
    // setOtpVerified(false);

    try {
      setIsSending(true);
      await sendOtp(formData.email); // Success state
      setOtpSent(true);
      setCountdown(60);
      toast.success("OTP sent to your email.");
    } catch (err) {
      // 2. Log the error for debugging (this is where you see the "email already exist" message)
      console.error(
        "OTP Send Error:",
        err.response?.data?.error || err.message
      );
      toast.error(err.response?.data?.error || "Failed to connect to server.");

      // 3. Extract the error and store it in the state variable rendered on the display
      const errorMessage =
        err.response?.data?.error || "Failed to connect to server.";
      setServerError(errorMessage); // <-- THIS is the key to displaying the error

      // Ensure flow stops:
      setOtpSent(false);
      setCountdown(0);
    } finally {
      setIsSending(false);
    }
  };

  // const handleVerifyOtp = async () => {
  //   if (!otp) return setOtpError("Please enter OTP.");
  //   try {
  //     setIsVerifying(true);
  //     await verifyOtp(formData.email, otp);
  //     setOtpVerified(true);
  //     setOtpError("");

  //   } catch (err) {
  //     setOtpError(err.response?.data?.error || "Invalid or expired OTP.");
  //   } finally {
  //     setIsVerifying(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!otpVerified) return setOtpError("Please verify your email with OTP.");
    try {
      await registerUser({ ...formData, otp });
      setIsSuccess(true);
      toast.success("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong.");
      // console.log("err", err);
      setServerError(err.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
            Create Account
          </h1>
          <p className="text-gray-400">Sign up to get started</p>
        </div>

        <div className="bg-zinc-900 rounded-3xl p-8 shadow-2xl border border-zinc-800">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                required
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-black border border-zinc-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3.5 pr-28 bg-black border ${
                    serverError ? "border-red-500" : "border-zinc-700"
                  } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors`}
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSending || countdown > 0}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-black px-3 py-2 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSending
                    ? "Sending..."
                    : countdown > 0
                    ? `${countdown}s`
                    : "Send OTP"}
                </button>
              </div>
              {serverError && (
                <p className="text-red-500 text-sm mt-2">{serverError}</p>
              )}
            </div>

            {otpSent && (
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Enter OTP
                </label>
                <div className="relative">
                  <input
                    id="otp"
                    type="text"
                    maxLength={4}
                    placeholder="Enter 4-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-3.5 pr-28 bg-black border border-zinc-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
                  />
                  {/* <button
                    type="button"
                    // onClick={handleVerifyOtp}
                    disabled={isVerifying || otpVerified}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 px-3 py-2 text-xs font-medium rounded-lg transition-colors disabled:cursor-not-allowed ${
                      otpVerified
                        ? "bg-green-500 text-white"
                        : "bg-white text-black hover:bg-gray-200 disabled:opacity-50"
                    }`}
                  >
                    {isVerifying
                      ? "Verifying..."
                      : otpVerified
                        ? "✓ Verified"
                        : "Verify"}
                  </button> */}
                </div>
                {otpError && (
                  <p className="text-red-500 text-sm mt-2">{otpError}</p>
                )}
              </div>
            )}

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                required
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-black border border-zinc-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!otpSent || isSuccess}
              className={`w-full py-3.5 rounded-xl font-semibold transition-colors ${
                !otpSent || isSuccess
                  ? "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                  : "bg-white text-black hover:bg-gray-200"
              }`}
            >
              {isSuccess ? "✓ Registration Successful" : "Create Account"}
            </button>
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-zinc-900 text-gray-400">
                or continue with
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="text-center text-gray-400 text-sm p-4 border border-zinc-700 rounded-lg">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  const data = await loginWithGoogle(
                    credentialResponse.credential
                  );
                  if (!data.error) navigate("/");
                }}
                onError={() => console.log("Login Failed")}
                theme="filled_blue"
                text="continue_with"
                useOneTap
              />
            </div>
          </div>
        </div>

        <p className="text-center text-gray-400 text-sm mt-8">
          Already have an account?{" "}
          <Link to="/login" className="text-white font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
