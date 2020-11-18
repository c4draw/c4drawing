import "./global.css";

import React, { Suspense } from "react";
import Routes from "./routes";
import { BrowserRouter } from "react-router-dom";

import Loading from "views/Loading";

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes />
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
