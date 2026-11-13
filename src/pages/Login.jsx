import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const benefits = [
  {
    icon: assets.fast_delivery,
    title: "Fast Delivery",
    copy: "Reliable shipping across the UAE.",
  },
  {
    icon: assets.quality_icon,
    title: "Safe Payment",
    copy: "Secure checkout with trusted gateways.",
  },
  {
    icon: assets.support_img,
    title: "24/7 Help Center",
    copy: "Support whenever you need it.",
  },
  {
    icon: assets.exchange_icon,
    title: "Hassle-Free Returns",
    copy: "Simple returns on eligible products.",
  },
  {
    icon: assets.shield,
    title: "Friendly Services",
    copy: "Expert help for security & living products.",
  },
];

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isSignUp = currentState === "Sign Up";

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        const response = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Account created successfully");
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Welcome back");
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  return (
    <div className="flex h-screen max-h-screen flex-col overflow-hidden bg-white">
      {/* Taller logo header */}
      <header className="flex h-20 shrink-0 items-center bg-kaboz-ink px-6 sm:h-24 sm:px-10 lg:px-14">
        <Link to="/" className="inline-flex items-center">
          <img
            src={assets.logo}
            alt="Kaboz"
            className="h-11 w-auto rounded bg-white px-3 py-1.5 sm:h-12"
          />
        </Link>
      </header>

      {/* Content fills remaining height */}
      <div className="flex min-h-0 flex-1 items-center">
        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 items-start gap-10 px-6 sm:px-10 md:grid-cols-2 md:gap-14 lg:gap-16 lg:px-12">
          {/* Form */}
          <div className="w-full">
            <h1 className="font-display text-4xl font-bold text-kaboz-ink sm:text-5xl">
              {isSignUp ? "Sign up" : "Sign in"}
            </h1>

            <form onSubmit={onSubmitHandler} className="mt-8 space-y-4">
              {isSignUp && (
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  className="w-full rounded-[6px] border border-kaboz-line bg-white px-4 py-3.5 text-base text-kaboz-ink outline-none transition placeholder:text-kaboz-mute focus:border-kaboz-orange"
                  placeholder="Enter name"
                  required
                />
              )}

              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                className="w-full rounded-[6px] border border-kaboz-line bg-white px-4 py-3.5 text-base text-kaboz-ink outline-none transition placeholder:text-kaboz-mute focus:border-kaboz-orange"
                placeholder="Enter email"
                required
              />

              <div className="relative">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-[6px] border border-kaboz-line bg-white px-4 py-3.5 pr-16 text-base text-kaboz-ink outline-none transition placeholder:text-kaboz-mute focus:border-kaboz-orange"
                  placeholder="Enter password"
                  required
                  minLength={isSignUp ? 8 : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-kaboz-mute hover:text-kaboz-orange"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {!isSignUp && (
                <button
                  type="button"
                  className="text-base font-medium text-kaboz-orange underline underline-offset-2 hover:text-kaboz-orange-dark"
                >
                  Forgot your password?
                </button>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-[6px] bg-kaboz-orange py-4 text-base font-bold text-white transition hover:bg-kaboz-orange-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Please wait…"
                  : isSignUp
                    ? "Sign Up"
                    : "Login"}
              </button>
            </form>

            <p className="mt-6 text-base text-kaboz-mute">
              {isSignUp
                ? "Already have an account? "
                : "doesn't have an account? "}
              <button
                type="button"
                onClick={() =>
                  setCurrentState(isSignUp ? "Login" : "Sign Up")
                }
                className="font-semibold text-kaboz-green underline underline-offset-2 hover:text-kaboz-green-dark"
              >
                {isSignUp ? "sign in" : "sign up"}
              </button>
            </p>
          </div>

          {/* Benefits */}
          <div className="hidden w-full md:block">
            <h2 className="font-display text-3xl font-bold text-kaboz-ink sm:text-4xl">
              Create a Kaboz account
            </h2>
            <p className="mt-2 text-base text-kaboz-mute">
              For faster checkout & order tracking
            </p>

            <ul className="mt-8 space-y-5">
              {benefits.map((item) => (
                <li key={item.title} className="flex items-start gap-4">
                  <img
                    src={item.icon}
                    alt=""
                    className="mt-0.5 h-9 w-9 flex-shrink-0 object-contain brightness-0"
                  />
                  <div>
                    <p className="text-lg font-bold text-kaboz-ink">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-sm leading-snug text-kaboz-mute sm:text-base">
                      {item.copy}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="shrink-0 border-t border-kaboz-line">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-1 px-6 py-4 text-sm text-kaboz-mute sm:flex-row sm:px-10 lg:px-12">
          <div className="flex flex-wrap items-center gap-x-2">
            <Link to="/about" className="hover:text-kaboz-orange">
              About
            </Link>
            <span className="text-[#ccc]">|</span>
            <Link to="/faq" className="hover:text-kaboz-green">
              FAQ
            </Link>
            <span className="text-[#ccc]">|</span>
            <Link to="/contact" className="hover:text-kaboz-red">
              Contact
            </Link>
          </div>
          <p>Copyright © Kaboz. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
