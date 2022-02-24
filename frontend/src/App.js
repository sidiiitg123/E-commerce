
import './App.css';
import Header from "./component/layout/Header/Header.js"
import { BrowserRouter as Router } from "react-router-dom"
import WebFont from "webfontloader"
import react from "react"
import { useEffect } from "react"

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
    </Router>

  );
}

export default App;
