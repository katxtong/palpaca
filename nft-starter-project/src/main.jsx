import React from 'react'
import ReactDOM from 'react-dom'
import './styles/index.css'
import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)


// import React from 'react';
// import ReactDOM from 'react-dom';
// import './styles/index.css';
// import App from './App';
// import { MetaMaskProvider } from "@metamask/sdk-react";

// ReactDOM.render(
//   <React.StrictMode>
//     <MetaMaskProvider
//       debug={false}
//       sdkOptions={{
//         dappMetadata: {
//           name: "Example React Dapp",
//           url: window.location.href,
//         },
//         // Other options
//       }}
//     >
//       <App />
//     </MetaMaskProvider>
//   </React.StrictMode>,
//   document.getElementById('root')
// );
