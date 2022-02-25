import React from 'react'
import { Link } from "react-router-dom"
import ReactStars from "react-rating-stars-component"



function ProductCard({ product }) {

  const options = {
    edit: false,
    color: "rgba(20,20,20,0.1)",
    activeColor: "Tomato",
    value: product.ratings,
    isHalf: true,
    size: window.innerWidth < 600 ? 10 : 15

  }


  return (
    <Link className="productCard" to={product._id}>
      <img src=" https://cdn.pixabay.com/photo/2020/10/21/18/07/laptop-5673901_960_720.jpg" alt={product.name} />
      <p>{product.name}</p>
      <div>
        <ReactStars {...options} />
        <span className="productCardSpan">({product.numOfReviews} Reviews)
        </span>
      </div>
      <span>{`₹${product.price}`}</span>
    </Link>
  )
}

export default ProductCard