
import './App.css';
import Header from "./component/layout/Header/Header.js"
import { BrowserRouter as Router, Route } from "react-router-dom"
import WebFont from "webfontloader"
import react from "react"
import { useEffect } from "react"
import Footer from "./component/layout/Footer/Footer"
import Home from "./component/Home/Home"
import Loader from './component/layout/Loader/Loader';
import ProductDetails from './component/Product/ProductDetails';
import Products from './component/Product/Products';
import Search from "./component/Product/Search"


function App() {
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    })
  });
  return (
    <Router>
      <Header />
      <Route exact path="/" component={Home} />
      <Route exact path="/product/:id" component={ProductDetails} />
      <Route exact path="/products" component={Products} />
      <Route exact path="/search" component={Search} />
      <Route exact path="/products/:keyword" component={Products} />

      <Footer />
    </Router>

  );
}

export default App;
