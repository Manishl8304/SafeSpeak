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

export const Navbar = () => {
  const { toast } = useToast();
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/user/login`,
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
    } catch (err) {
      console.log(err);
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

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-3xl font-bold text-blue-800">SafeSpeak</div>
        <div className="space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Log In</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log In</DialogTitle>
                <DialogDescription>
                  Enter your credentials to log in
                </DialogDescription>
              </DialogHeader>
              <form
                className="space-y-4"
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
                      className="pl-10"
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
                      className="pl-10"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Logging In..." : "Log In"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Sign Up</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Sign Up</DialogTitle>
                <DialogDescription>Create a new account</DialogDescription>
              </DialogHeader>
              <form
                className="space-y-4"
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
                      className="pl-10"
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
                      className="pl-10"
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
                      className="pl-10"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing Up..." : "Sign Up"}
                </Button>
                {error && (
                  <p className="text-red-600" aria-live="polite">
                    {error}
                  </p>
                )}
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </nav>
  );
};
