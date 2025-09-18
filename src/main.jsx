import { StrictMode } from "react";
import { Toaster } from "react-hot-toast";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App.jsx";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./redux/store.js";
import { BrowserRouter } from "react-router";
import ScrollToTopButton from "./components/common/ScrollToTopButton.jsx";
import ScrollToTop from "./components/common/ScrollToTop.jsx";
import { QueryClientProvider } from "@tanstack/react-query";
import PhoneCallIcon from "./components/common/PhoneCallIcon.jsx";
import { queryClient } from "./QueryClient.js";
createRoot(document.getElementById("root")).render(
    <BrowserRouter>

        <ReduxProvider store={store}>
            <QueryClientProvider client={queryClient}>

                <App />
            </QueryClientProvider>
            <Toaster
                containerStyle={{
                    zIndex: 999999999999,
                    textTransform: "capitalize",
                }}
            />
            <ScrollToTopButton />
            <ScrollToTop />
            <PhoneCallIcon />
        </ReduxProvider>
    </BrowserRouter>
);
