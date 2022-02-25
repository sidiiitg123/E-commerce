import React, { Fragment, useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import "./ProductDetails.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProductDetails } from "../../actions/productAction"
import ReactStars from "react-rating-stars-component"
import "./ProductDetails.css"
import ReviewCard from "./ReviewCard"
import Loader from "../layout/Loader/Loader"
import { useAlert } from "react-alert"

function ProductDetails({ match }) {
  const dispatch = useDispatch()
  const alert = useAlert()

  const { product, loading, error } = useSelector((state) => state.productDetails)

  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearErrors())
    }
    dispatch(getProductDetails(match.params.id))
  }, [match.params.id, dispatch, error, alert])

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
      {loading ? <Loader /> : <Fragment>
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
              <ReactStars {...options} />
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

        <h3 className="reviewsHeading">REVIEWS</h3>
        {product.reviews && product.reviews[0] ? (
          <div className="reviews">
            {product.reviews &&
              product.reviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
          </div>
        ) : (
          <p className="noReviews">No Reviews Yet</p>
        )}
      </Fragment>}
    </Fragment>
  )
}

export default ProductDetails