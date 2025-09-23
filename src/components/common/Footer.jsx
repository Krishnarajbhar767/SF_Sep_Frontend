import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import axiosInstance from "../../utils/apiConnector";
import { handleAxiosError } from "../../utils/handleAxiosError";
import LOGO from "../../assets/images/logo/SRIJAN FABS PNG VERTICAL.png";
import { BsInstagram } from "react-icons/bs";

import {
    FaFacebookF,
    FaLinkedin,
    FaPinterest,
    FaChevronUp,

} from "react-icons/fa";


const primaryColor = "rgb(83, 62, 45)";

const Footer = () => {
    const categories = useSelector((state) => state.category.categories) || [];

    const { register, handleSubmit, reset } = useForm();

    const subscribeNewsHandler = async (data) => {
        const toastId = toast.loading("Please wait...");
        try {
            await axiosInstance.post("/newsletter", data);
            toast.success("Thanks for subscribing!");
            reset();
        } catch (error) {
            handleAxiosError(error);
        } finally {
            toast.dismiss(toastId);
        }
    };

    const socials = [
        {
            icon: FaFacebookF,
            link: "https://www.facebook.com/share/16oA9AL3Bn/",
        },
        {
            icon: FaLinkedin,
            link: "https://www.linkedin.com/company/srijan-fabs/",
        },
        {
            icon: FaPinterest,
            link: "https://pin.it/4Y8ChoBph"
        },
        {
            icon: BsInstagram,
            link: "https://www.instagram.com/srijanfabs/"
        }
    ];

    return (
        <footer
            className="bg-[#E4E4E4] pt-12 pb-4"
            style={{ color: primaryColor }}
        >

            <div className="container mx-auto px-2">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
                    {/* Company Info */}
                    <div>
                        {/* <h2 className="text-2xl font-bold mb-4">SRIJAN</h2> */}
                        <img
                            src={LOGO}
                            alt="srijanFab_logo"
                            className="mb-3 relative"
                        />
                        <p className="text-sm mb-2">
                            2nd Floor, C.K 20/9 Shetla Katra Thatheri Bazar
                            <br />
                            Varanasi, Uttar Pradesh 221010
                        </p>
                        <p className="text-sm mb-2"><b>Email : </b> srijanfabs@gmail.com  / support@srijanfabs.in</p>
                        <p className="text-sm"> <b>Phone :</b>+91 8960500991 / 6307116564</p>
                        {/* <p className="text-sm mb-6">+91 </p> */}
                        <div className="flex space-x-3 mt-7">
                            {socials.map((item, idx) => (
                                <a
                                    href={item.link}
                                    key={idx}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:opacity-70 transition-opacity"
                                    style={{ color: primaryColor }}
                                >
                                    <item.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Company</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/">Home</Link>
                            </li>
                            <li>
                                <Link to="/about">About Us</Link>
                            </li>
                            <li>
                                <Link to="/contact">Contact Us</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/privacy-policy">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link to="/refund-policy">Refund Policy</Link>
                            </li>
                            <li>
                                <Link to="/shipping-policy">
                                    Shipping Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms-of-service">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Our Products - Dynamic */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Our Products</h3>

                        <ul className="space-y-2 text-sm">
                            {Array.isArray(categories) && categories.map((cat) => {
                                const slug = slugify(cat.name, { lower: true });
                                return (
                                    <li key={cat._id}>
                                        <Link
                                            className="capitalize"
                                            to={`/products/${slug}/${cat._id}`}
                                        >
                                            {cat.name}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>


                    </div>

                    {/* Newsletter */}
                    <div className="col-span-2 md:col-span-1">
                        <h3 className="font-bold text-lg mb-4">Subscribe</h3>
                        <p className="text-sm mb-4">
                            Get updates on new designs, promotions & interior
                            tips.
                        </p>
                        <form
                            onSubmit={handleSubmit(subscribeNewsHandler)}
                            className="flex flex-col sm:flex-row gap-2 mb-4"
                        >
                            <input
                                {...register("email")}
                                type="email"
                                required
                                placeholder="Your email address"
                                className="w-full p-2 border outline-foreground focus:ring-2 focus:ring-foreground focus:rounded-none"
                            />
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-4 py-2 bg-[rgb(83,62,45)] text-white font-medium"
                            >
                                JOIN
                            </button>
                        </form>
                        <p className="text-sm font-medium mb-2">
                            Secure payments
                        </p>
                        <img
                            src="https://uomo-html.flexkitux.com/images/payment-options.png"
                            alt="Payment Methods"
                            className="h-6 object-contain"
                        />
                    </div>
                </div>

                <div className="border-t pt-4 text-sm flex flex-col sm:flex-row justify-between items-center">

                    {/* <p href="https://mediafleetblue.com/">Made with ❤️ by Media Fleetblue.</p> */}

                    <p>Copyright &copy; 2025 Srijan Fabs. All rights reserved.</p>


                    <a


                        href="#top"
                        className="mt-4 sm:mt-0 flex items-center gap-1 hover:underline cursor-pointer"
                    >
                        Back to Top <FaChevronUp />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
