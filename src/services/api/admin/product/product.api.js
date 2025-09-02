// import axiosInstance from "../../../../utils/apiConnector";
// import productEndpoints from "../../../endpoints/admin/product/product.endpoints";

// const productApis = {
//     createProduct: async (productData) => {
//         const res = await axiosInstance.post(
//             productEndpoints.createProduct,
//             productData
//         );
//         return res?.data?.data;
//     },
//     updateProduct: async (productData, productId) => {
//         const res = await axiosInstance.put(
//             productEndpoints.updateProduct(productId),
//             productData
//         );
//         return res?.data?.data;
//     },
// };

// export default productApis;


// 4 Aug 
import axiosInstance from "../../../../utils/apiConnector";
import productEndpoints from "../../../endpoints/admin/product/product.endpoints";

const productApis = {
    // Create Product
    createProduct: async (productData) => {
        const res = await axiosInstance.post(
            productEndpoints.createProduct,
            productData
        );
        return res?.data?.data;
    },

    // Update Product
    updateProduct: async (productData, productId) => {
        const res = await axiosInstance.put(
            productEndpoints.updateProduct(productId),
            productData
        );
        return res?.data?.data;
    },

    // Delete Product
    deleteProduct: async (productId) => {
        const res = await axiosInstance.delete(
            productEndpoints.deleteProduct(productId)
        );
        return res?.data?.data;
    },

    //  Get All Products
    getAllProducts: async () => {
        const res = await axiosInstance.get(productEndpoints.getAllProducts);
        return res?.data?.data;
    },

    //  Get Single Product by ID
    getProductById: async (productId) => {
        const res = await axiosInstance.get(
            productEndpoints.getProductById(productId)
        );
        return res?.data?.data;
    },
};

export default productApis;

