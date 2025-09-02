import { FixedSizeList } from "react-window";
import ProductCard from "./../../public/category/ProductCard.jsx";

const ProductList = ({ filteredProducts, viewMode, navigate }) => {

    // console.log("Rendering ProductList", filteredProducts.length);
    
    return (
        <FixedSizeList
            height={600}
            itemCount={items.length}
            itemSize={150}
            overscanCount={10} // instead of 5
        >
            {({ index, style }) => (
                <div style={style}>

                    <ProductCard
                        product={filteredProducts[index]}
                        viewMode={viewMode}
                        navigate={navigate}
                    />

                </div>
            )}
        </FixedSizeList>
    );
};

export default ProductList;
