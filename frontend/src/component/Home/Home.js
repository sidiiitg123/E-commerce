import { React, Fragment, useEffect } from 'react'
import { CgMouse } from "react-icons/all";
import "./Home.css"
import ProductCard from './ProductCard';
import MetaData from "../layout/MetaData"
import { getProduct } from "../../actions/productAction"
import { useSelector, useDispatch } from "react-redux"
import Loader from '../layout/Loader/Loader';

const product = {
  name: "Blue Tshirt",
  price: "3000",
  _id: "sudhanshu",
  images: [{ url: "https://cdn.pixabay.com/photo/2020/10/21/18/07/laptop-5673901_960_720.jpg" }]
}

function Home() {

  const dispatch = useDispatch()
  const { loading, error, products, productsCount } = useSelector((state) => state.products)

  useEffect(() => {
    dispatch(getProduct())
  }, [dispatch])


  return (

    <Fragment>
      {loading ? <Loader /> : <Fragment>
        <MetaData title="CARTEASY" />

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
          {products && products.map((product) => <ProductCard product={product} />)}
        </div>

      </Fragment>}
    </Fragment>

  )
}

export default Home