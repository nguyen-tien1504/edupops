import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import SignUp from "./Pages/Sign up/SignUp";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  { path: "/signup", element: <SignUp /> },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
