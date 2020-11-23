import './global.css';

import React from 'react';

import Routes from './routes';

function App() {
  return (
    // <BrowserRouter>
    //   <Suspense fallback={<Loading />}>
    <Routes />
    //   </Suspense>
    // </BrowserRouter>
  );
}

export default App;
