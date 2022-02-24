import { React, Fragment } from 'react'
import { CgMouse } from "react-icons/all";
import "./Home.css"
import ProductCard from './ProductCard';


const product = {
  name: "Blue Tshirt",
  price: "3000",
  _id: "sudhanshu",
  images: [{ url: "https://cdn.pixabay.com/photo/2020/10/21/18/07/laptop-5673901_960_720.jpg" }]
}

function Home() {


  return (
    <Fragment>

      <div className="banner">
        <p>Welcome to CARTEASY</p>
        <h1>FIND AMAZING PRODUCTS ONLY HERE</h1>

        <a href="#container">
          <button>
            Scroll <CgMouse />
          </button>
        </a>
      </div>

      <h2 className="homeHeading">Featured Products</h2>
      <div className="container" id="container">

        <ProductCard key={product._id} product={product} />
        <ProductCard key={product._id} product={product} />
        <ProductCard key={product._id} product={product} />
        <ProductCard key={product._id} product={product} />
        <ProductCard key={product._id} product={product} />

        <ProductCard key={product._id} product={product} />
        <ProductCard key={product._id} product={product} />
        <ProductCard key={product._id} product={product} />
        <ProductCard key={product._id} product={product} />
      </div>

    </Fragment>
  )
}

export default Home