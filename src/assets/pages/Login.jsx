import React from "react";
import Lottie from "lottie-react";
import LoginAnimationData from "../Lottie/login-animation.json";
import {
  auth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "../Auth/firebase.init";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must contain at least 6 characters, including uppercase, lowercase, and a number."
      );
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      toast.success("Login Successful!");
      navigate("/");
    } catch (e) {
      toast.error(`Login Failed! ${e.message}`);
      console.log(e);
    }
  };
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    try {
      toast.success("Login Successful!");
      navigate("/");
    } catch (e) {
      toast.error(`Login Failed! ${e.message}`);
      console.log(e);
    }
  };
  return (
    <div>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center">
            <div className="w-96 hidden  lg:block">
              <Lottie animationData={LoginAnimationData} />
            </div>
          </div>
          <div className="card bg-yellowPrimary w-full max-w-sm shrink-0 shadow-2xl">
            <form onSubmit={handleSubmit} className="card-body">
              <h1 className="text-5xl text-center font-bold">Login now!</h1>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="email"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="password"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-primary bg-bluePrimary hover:bg-blueSecondary">
                  Login
                </button>

                <div className="divider">OR</div>

                <button
                  onClick={handleGoogleLogin}
                  className="flex items-center justify-center w-full py-3 border bg-bluePrimary rounded-lg hover:bg-blueSecondary"
                >
                  <FcGoogle />
                  <span className="text-gray-700 dark:text-black ml-2">
                    Login with Google
                  </span>
                </button>
              </div>
              <div className="text-center mt-4">
                <Link
                  to="/register"
                  className="text-sm text-indigo-600 hover:underline"
                >
                  Don't have an account? Register
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
