import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import Home from "./Pages/Home/Home";
import SignUp from "./Pages/Sign up/SignUp";
const RequireAuth = ({ children }) => {
  return localStorage.getItem("id") ? children : <Navigate to="/" />;
};
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  { path: "/signup", element: <SignUp /> },
  {
    path: "/home",
    element: (
      <RequireAuth>
        <Home />
      </RequireAuth>
    ),
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
