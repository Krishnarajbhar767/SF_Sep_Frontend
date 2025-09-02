

import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppRoutes from "./routes/AppRoutes.jsx";
import { clearUser, setAuthLoading, setUser } from "./redux/slices/userSlice";
import { setIsProductLoaded, setProducts } from "./redux/slices/productSlice";
import {
    setCategories,
    setIsCategoriesLoaded,
} from "./redux/slices/categorySlice";
import { setCart } from "./redux/slices/cartSlice";
import { setWishList } from "./redux/slices/wishListSlice";
import { setFabrics } from "./redux/slices/fabricSlice";

import authApis from "./services/api/auth/auth.apis";
import productApis from "./services/api/public/products.apis";
import categoriesApi from "./services/api/public/category.api";
import axiosInstance from "./utils/apiConnector";
import { handleAxiosError } from "./utils/handleAxiosError";

function App() {
    const dispatch = useDispatch();

    const { token, user } = useSelector((state) => state.user);
    const isProductLoaded = useSelector((state) => state.product.isLoaded);
    const isCategoryLoaded = useSelector((state) => state.category.isLoaded);

    const hasFetchedUser = useRef(false);


    // ========== CALLBACKS ==========


    const fetchUser = useCallback(async () => {
        dispatch(setAuthLoading(true));
        try {
            const userData = await authApis.getUser(token);
            dispatch(setUser(userData));
        } catch (err) {
            dispatch(clearUser());
            handleAxiosError(err);
        }
    }, [dispatch, token]);

    const fetchProducts = useCallback(async () => {
        try {
            const products = await productApis.getAllProduct();
            dispatch(setProducts(products));
            dispatch(setIsProductLoaded(true));
        } catch (err) {
            handleAxiosError(err);
        }
    }, [dispatch]);

    const fetchCategories = useCallback(async () => {
        try {
            const categories = await categoriesApi.getAllCategories();
            dispatch(setCategories(categories));
            dispatch(setIsCategoriesLoaded(true));
        } catch (err) {
            handleAxiosError(err);
        }
    }, [dispatch]);

    const fetchCartAndWishlist = useCallback(async () => {
        try {
            if (user) {
                const [cartRes, wishListRes] = await Promise.all([
                    axiosInstance.get(`/user/cart/${user._id}`),
                    axiosInstance.get(`/user/wishlist/${user._id}`),
                ]);
                dispatch(setCart(cartRes.data));
                dispatch(setWishList(wishListRes.data));
            } else {
                const localCart =
                    JSON.parse(localStorage.getItem("cart")) || [];
                dispatch(setCart(localCart));
            }
        } catch (err) {
            handleAxiosError(err);
        }
    }, [dispatch, user]);

    const fetchFabrics = useCallback(async () => {
        try {
            const res = await axiosInstance.get("/admin/fabrics/");
            dispatch(setFabrics(res.data));
        } catch (err) {
            handleAxiosError(err);
        }
    }, [dispatch]);

    // ========== EFFECTS ==========

    useEffect(() => {
        if (!isProductLoaded) fetchProducts();
    }, [isProductLoaded, fetchProducts]);

    useEffect(() => {
        if (!isCategoryLoaded) fetchCategories();
    }, [isCategoryLoaded, fetchCategories]);

    useEffect(() => {
        if (token && !user && !hasFetchedUser.current) {
            hasFetchedUser.current = true;
            fetchUser();
        }
    }, [token, user, fetchUser]);

    useEffect(() => {
        fetchCartAndWishlist();
    }, [fetchCartAndWishlist]);

    useEffect(() => {
        fetchFabrics();
    }, [fetchFabrics]);

    return <AppRoutes />;
}

export default App;
