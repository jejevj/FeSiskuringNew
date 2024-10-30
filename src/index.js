import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap/modules/fontawesome/css/all.min.css";
import "bootstrap/modules/jqvmap/dist/jqvmap.min.css";
import "bootstrap/modules/summernote/summernote-bs4.css";
import "bootstrap/modules/owlcarousel2/dist/assets/owl.carousel.min.css";
import "bootstrap/modules/owlcarousel2/dist/assets/owl.theme.default.min.css";
import "bootstrap/css/style.css";
import "bootstrap/css/components.css";
import { BrowserRouter } from 'react-router-dom';
// import "bootstrap/modules/jquery.min.js"
// import "bootstrap/modules/popper.js"
// import "bootstrap/modules/tooltip.js"
// import "bootstrap/modules/bootstrap/js/bootstrap.min.js"
// import "bootstrap/modules/nicescroll/jquery.nicescroll.min.js"
// import "bootstrap/modules/moment.min.js"
// import "bootstrap/js/stisla.js"
// import "bootstrap/modules/jquery.sparkline.min.js"
// import "bootstrap/modules/chart.min.js"
// import "bootstrap/modules/owlcarousel2/dist/owl.carousel.min.js"
// import "bootstrap/modules/summernote/summernote-bs4.js"
// import "bootstrap/modules/chocolat/dist/js/jquery.chocolat.min.js"
// import "bootstrap/js/page/index.js"
// import "bootstrap/js/scripts.js"
// import "bootstrap/js/custom.js"





const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <BrowserRouter>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
