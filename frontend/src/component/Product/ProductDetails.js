import React, { Fragment, useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import "./ProductDetails.css";
import { useSelector, useDispatch } from "react-redux";
import { getProductDetails } from "../../actions/productAction"
import { ReactStar } from "react-rating-stars-component"
import "./ProductDetails.css"

function ProductDetails({ match }) {
  const dispatch = useDispatch()

  const { product, loading, error } = useSelector((state) => state.productDetails)

  useEffect(() => {
    dispatch(getProductDetails(match.params.id))
  }, [match.params.id, dispatch])

  const options = {
    edit: false,
    color: 'rgba(20,20,20,0.10)',
    activeColor: "tomato",
    isHalf: true,
    value: product.ratings,
    size: window.innerWidth < 600 ? 10 : 15

  }

  return (
    <Fragment>
      <div className="ProductDetails">
        <div className="product-Details-carousel">
          <Carousel>
            {product.images &&
              product.images.map((item, i) => (
                <img
                  className="CarouselImage"
                  key={item.url}
                  src={item.url}
                  alt={`${i} Slide`}
                />
              ))}
          </Carousel>
        </div>
        <div>
          <div className="detailsBlock-1">
            <h2>{product.name}</h2>
            <p>Product # {product._id}</p>
          </div>
          <div className="detailsBlock-2">
            {/* <ReactStar {...options} /> */}
            <span className="detailsBlock-2-span">
              {" "}
              ({product.numOfReviews} Reviews)
            </span>
          </div>
          <div className="detailsBlock-3">
            <h1>{`₹${product.price}`}</h1>
            <div className="detailsBlock-3-1">
              <div className="detailsBlock-3-1-1">
                <button>-</button>
                <input readOnly type="number" />
                <button >+</button>
              </div>
              <button
                disabled={product.Stock < 1 ? true : false}
              >
                Add to Cart
              </button>
            </div>
            <p>
              Status:
              <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                {product.Stock < 1 ? "OutOfStock" : "InStock"}
              </b>
            </p>
            <div className="detailsBlock-4">
              Description : <p>{product.description}</p>
            </div>

            <button className="submitReview">
              Submit Review
            </button>

          </div>


        </div>

      </div>
    </Fragment>
  )
}

export default ProductDetails