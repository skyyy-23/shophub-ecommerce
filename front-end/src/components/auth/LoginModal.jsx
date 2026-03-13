import { useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiX } from "react-icons/fi";
import { apiEndpoints } from "../../config/api";
import { wasRemembered } from "../../services/authStorage";

function LoginModal({
  show,
  onClose,
  onLogin,
  onSwitchToRegister,
  mode = "user",
}) {
  const isAdminMode = mode === "admin";
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(() =>
    wasRemembered(isAdminMode ? "admin" : "user")
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const payload = {
        email: form.email.trim(),
        password: form.password,
      };
      const response = await fetch(
        isAdminMode ? apiEndpoints.adminLogin : apiEndpoints.login,
        {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        }
      );

      const data = await response.json().catch(() => null);

      if (response.ok && data?.success) {
        if (!data?.token || !data?.user) {
          setError("Unexpected response from server.");
          return;
        }
        if (isAdminMode && data.user.role !== "admin") {
          setError("This account is not an admin.");
          return;
        }
        onLogin({
          user: data.user,
          token: data.token,
          remember: rememberMe,
          scope: isAdminMode ? "admin" : "user",
        });
        onClose();
      } else {
        const validationErrors = data?.errors
          ? Object.values(data.errors).flat().join(", ")
          : null;
        if (validationErrors) {
          setError(validationErrors);
        } else if (response.status === 403) {
          const fallbackMessage = isAdminMode
            ? "Admin access required."
            : "Access denied.";
          setError(data?.message || fallbackMessage);
        } else if (response.status === 401) {
          setError("Invalid email or password.");
        } else {
          setError(data?.message || "Login failed. Please try again.");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(`Network error: ${err.message || "Please try again."}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-3 rounded-full">
              <FiUser className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-snug">
                {isAdminMode ? "Admin Sign In" : "Welcome Back"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {isAdminMode
                  ? "Sign in with your admin account"
                  : "Sign in to your account"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Close"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter your email"
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Keep me signed in
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        {onSwitchToRegister && (
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {isAdminMode ? "Need an admin account?" : "Don't have an account?"}{" "}
              <button
                onClick={onSwitchToRegister}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign up
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginModal;
