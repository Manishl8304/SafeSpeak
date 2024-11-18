import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Lock, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "./../../redux/slices/userSlice";
import { NavLink, useNavigate } from "react-router-dom";

export const Navbar = () => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/user/signup`,
        {
          userName: signupName,
          userEmail: signupEmail,
          userPass: signupPassword,
        }
      );
      toast({
        description: response.data.Message,
        variant: "success",
      });
      setSignupName("");
      setSignupEmail("");
      setSignupPassword("");
    } catch (err) {
      const errorMessage =
        err.response?.data?.Message || "Sign-up failed. Please try again.";
      setError(errorMessage);
      toast({
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log(import.meta.env.VITE_SERVER_URL);
      const response = await axios.post(
        `https://safespeak-backend-production-6850.up.railway.app/api/user/login`,
        {
          userEmail: loginEmail,
          userPass: loginPassword,
        },
        { withCredentials: true }

      );
      toast({
        description: response.data.Message,
        variant: "success",
      });
      setLoginEmail("");
      setLoginPassword("");
      dispatch(login({ ...response.data.user, token: response.data.token }));
      navigate("/");
    } catch (err) {
      const errorMessage =
        err.response?.data?.Message || "Login failed. Please try again.";
      setError(errorMessage);
      toast({
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/user/logout`,
        { withCredentials: true }
      );
      toast({
        description: response.data.Message,
        variant: "success",
      });
      dispatch(logout());
    } catch (err) {
      const errorMessage =
        err.response?.data?.Message || "Logout failed. Please try again.";
      toast({
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="bg-white shadow-md p-4 rounded-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-3xl font-bold text-blue-800">
          <NavLink to="/">SafeSpeak</NavLink>
        </div>
        <div className="space-x-4 flex items-center">
          {!isLoggedIn ? (
            <>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="px-6 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition">
                    Log In
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-xl">Log In</DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">
                      Enter your credentials to log in
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    className="space-y-6"
                    onSubmit={handleLogIn}
                    aria-busy={loading}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10 py-2"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="Enter your password"
                          className="pl-10 py-2"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                      disabled={loading}
                    >
                      {loading ? "Logging In..." : "Log In"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
                    Sign Up
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-xl">Sign Up</DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">
                      Create a new account
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    className="space-y-6"
                    onSubmit={handleSignUp}
                    aria-busy={loading}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="signup-name"
                          placeholder="Enter your name"
                          className="pl-10 py-2"
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10 py-2"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="Create a password"
                          className="pl-10 py-2"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                      disabled={loading}
                    >
                      {loading ? "Signing Up..." : "Sign Up"}
                    </Button>
                    {error && (
                      <p className="text-red-600 mt-2 text-sm" aria-live="polite">
                        {error}
                      </p>
                    )}
                  </form>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <div className="space-x-4 flex items-center">
              <NavLink to="/" className="text-lg text-blue-600 hover:underline">
                Home
              </NavLink>
              <NavLink to="/charts" className="text-lg text-blue-600 hover:underline">
                Charts
              </NavLink>
              <NavLink to="/submittedReports" className="text-lg text-blue-600 hover:underline">
                Submitted Reports
              </NavLink>
              <Button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Log Out
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
