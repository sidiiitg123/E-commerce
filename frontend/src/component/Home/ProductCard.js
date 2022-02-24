import React from 'react'
import { Link } from "react-router-dom"
import ReactStars from "react-rating-stars-component"


const options = {
  edit: false,
  color: "rgba(20,20,20,0.1)",
  activeColor: "Tomato",
  value: 2.5,
  isHalf: true,
  size: window.innerWidth < 600 ? 10 : 15

}
function ProductCard({ product }) {
  return (
    <Link className="productCard" to={product._id}>
      <img src={product.images[0].url} alt={product.name} />
      <p>{product.name}</p>
      <div>
        <ReactStars {...options} />
        <span className="productCardSpan">(256 Reviews)
        </span>
      </div>
      <span>{`₹${product.price}`}</span>
    </Link>
  )
}

export default ProductCard