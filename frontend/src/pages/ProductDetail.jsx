import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Plus,
  Minus,
  Loader,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import ReviewsContainer from "../components/Products/ReviewsContainer";
import { addToCart } from "../store/slices/cartSlice";
import { fetchProductDetails } from "../store/slices/productSlice";

const ProductDetail = () => {
  const {id} = useParams();
  const dispatch = useDispatch();
  const product = useSelector((state)=> state.product?.productDetails);
  const {loading, productReviews}  = useSelector((state)=> state.product);
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("description");

  const handleAddToCart = ()=> {
    dispatch(addToCart({product, quantity}))
  }

  useEffect(()=> {
    dispatch(fetchProductDetails(id));

  }, [dispatch, id]);

  if(!product){
    return(
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Product not found
          </h1>

          <p className="text-muted-foreground"> The product you are looking for does not exist.</p>
        </div>
      </div>
    )
  }
  if(loading){
    return(
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin"/>
      </div>
    )
  }

  return <>
  

  <div className="min-h-screen pt-20">
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

  {/* LEFT SIDE - PRODUCT IMAGES */}
  <div>
    <div className="glass-card p-4 mb-4">
      {product?.images?.length > 0 ? (
        <img
          src={product.images[selectedImage]?.url}
          alt={product.name}
          className="w-full h-[500px] object-contain rounded-lg"
        />
      ) : (
        <div className="h-[500px] animate-pulse bg-secondary rounded-lg" />
      )}
    </div>

    <div className="flex gap-3 flex-wrap">
      {product?.images?.map((image, index) => (
        <button
          key={index}
          onClick={() => setSelectedImage(index)}
          className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
            selectedImage === index
              ? "border-primary"
              : "border-border"
          }`}
        >
          <img
            src={image.url}
            alt={`${product.name}-${index}`}
            className="w-full h-full object-cover"
          />
        </button>
      ))}
    </div>
  </div>

  {/* RIGHT SIDE - PRODUCT DETAILS */}
  <div className="flex flex-col justify-start">

    {/* Badges */}
    <div className="flex gap-2 mb-4">
      {new Date() - new Date(product.createdAt) <
        30 * 24 * 60 * 60 * 1000 && (
        <span className="px-3 py-1 bg-primary text-white text-xs rounded-full">
          NEW
        </span>
      )}

      {product?.rating >= 4.5 && (
        <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-rose-500 text-white text-xs rounded-full">
          TOP RATED
        </span>
      )}
    </div>

    {/* Product Name */}
    <h1 className="text-4xl font-bold text-foreground mb-4">
      {product?.name}
    </h1>

    {/* Rating */}
   <div className="flex items-center gap-3 mb-6">
  <div className="flex">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < Math.floor(product?.ratings || product?.rating || 0)
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-400"
        }`}
      />
    ))}
  </div>

  <span className="font-semibold">
    {product?.ratings || product?.rating || 0}
  </span>

  <span className="text-muted-foreground">
    ({productReviews?.length || 0} Reviews)
  </span>
</div>


    {/* Price */}
    <div className="mb-6">
      <span className="text-4xl font-bold text-primary">
        $
        {Number(product?.price || 0).toLocaleString("en-US")}
      </span>
    </div>

    {/* Description review */}
    <div className="glass-panel">
  <div className="flex border-b border-[hsla(var(--glass-border))]">
    {["description", "reviews"].map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`px-6 py-4 font-medium capitalize transition-all ${
          activeTab === tab
            ? "text-primary border-b-2 border-primary"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {tab}
      </button>
    ))}
  </div>

  <div className="p-6">
    {activeTab === "description" && (
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-4">
          Product Description
        </h3>

        <p className="text-muted-foreground leading-relaxed">
          {product?.description}
        </p>
      </div>
    )}

    {activeTab === "reviews" && (
      <ReviewsContainer
        product={product}
        productReviews={productReviews}
      />
    )}
  </div>
</div>
    

    {/* Stock */}
    <div className="mb-6">
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          product?.stock > 5
            ? "bg-green-500/20 text-green-400"
            : product?.stock > 0
            ? "bg-yellow-500/20 text-yellow-400"
            : "bg-red-500/20 text-red-400"
        }`}
      >
        {product?.stock > 5
          ? "In Stock"
          : product?.stock > 0
          ? "Limited Stock"
          : "Out Of Stock"}
      </span>
    </div>

   <div className="glass-card p-6 mb-6"> 
                <div className="flex items-center space-x-4 mb-6"> 
                  <span className="text-lg 
font-medium">Quantity:</span> 
                  <div className="flex items-center space-x-3"> 
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 
1))} 
                      className="p-2 glass-card hover:glow-on-hover 
animate-smooth" 
                    > 
                      <Minus className="w-4 h-4" /> 
                    </button> 
                    <span className="w-12 text-center font-semibold 
text-lg"> 
                      {quantity} 
                    </span> 
                    <button 
                      onClick={() => setQuantity(quantity + 1)} 
                      className="p-2 glass-card hover:glow-on-hover 
animate-smooth" 
                    > 
                      <Plus className="w-4 h-4" /> 
                    </button> 
                  </div> 
                </div> 
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
                  <button 
                    onClick={handleAddToCart} 
                    disabled={product.stock === 0} 
                    className="flex items-center justify-center 
space-x-2 py-3 gradient-primary text-primary-foreground rounded-lg 
hover:glow-on-hover animate-smooth font-semibold disabled:opacity-50 
disabled:cursor-not-allowed" 
                  > 
                    <ShoppingCart className="w-5 h-5" /> 
                    <span>Add to Cart</span> 
                  </button> 
                  <button 
                    disabled={product.stock === 0} 
                    className="py-3 bg-secondary text-foreground border 
border-border rounded-lg hover:bg-accent animate-smooth font-semibold 
disabled:opacity-50 disabled:cursor-not-allowed" 
                  > 
                    Buy Now 
                  </button> 
                </div> 
                <div className="flex items-center space-x-4 mt-4"> 
                  <button className="flex items-center space-x-2 
text-muted-foreground hover:text-primary animate-smooth"> 
                    <Heart className="w-5 h-5" /> 
                    <span>Add to Wishlist</span> 
                  </button> 
                  <button className="flex items-center space-x-2 
text-muted-foreground hover:text-primary animate-smooth"> 
                    <Share2 className="w-5 h-5" /> 
                    <span>Share</span> 
                  </button> 
                </div> 
              </div> 
    
  </div>

</div>
    </div>
  </div>
  
  </>;
};

export default ProductDetail;
