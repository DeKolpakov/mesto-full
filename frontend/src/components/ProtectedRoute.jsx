import React from "react";
import {Navigate} from "react-router-dom";

function ProtectedRoute({element: Component, isLoggedIn, ...props}) {
  return isLoggedIn ? <Component {...props} /> : <Navigate to="/signin" replace />;
}

export default ProtectedRoute;
