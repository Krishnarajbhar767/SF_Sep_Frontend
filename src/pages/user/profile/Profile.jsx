




// 18 Aug 


import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiEdit, FiSave, FiLock } from "react-icons/fi";
import InputField from "../../../components/common/InputField";
import { useState } from "react";
import authApis from "../../../services/api/auth/auth.apis";
import toast from "react-hot-toast";
import { handleAxiosError } from "../../../utils/handleAxiosError";
import Button from "../../../components/common/Button";
import { setUser } from "../../../redux/slices/userSlice";
import axiosInstance from "../../../utils/apiConnector";

function Profile() {
    const user = useSelector((state) => state?.user?.user);
    const dispatch = useDispatch();
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // New state for loading

    // Profile form setup
    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        formState: { errors: profileErrors },
        reset: resetProfile,
    } = useForm({
        defaultValues: {
            firstName: user?.firstName,
            lastName: user?.lastName,
            email: user?.email,
            phone: user?.phone,
            gender: user?.gender,
            dob: user?.dob,
        },
    });

    // Password form setup
    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        formState: { errors: passwordErrors },
        watch: watchPassword,
        reset: resetPassword,
    } = useForm({
        defaultValues: {
            password: "",
            confirmPassword: "",
            oldPassword: "",
        },
    });

    // Handler to actually log out (called only after confirmation)
    async function logOutHandler() {
        const toastId = toast.loading("Please wait...");
        try {
            const res = await authApis.logOut();
            if (res) {
                toast.success("Logged out successfully");
                toast.dismiss(toastId);
            }
        } catch (error) {
            handleAxiosError(error);
            toast.dismiss(toastId);
        }
    }

    const onSubmitProfile = async (data) => {
        const toastId = toast.loading("Updating profile...");
        setIsSubmitting(true);

        try {
            const res = await axiosInstance.put('/user/update-profile', data);

            if (res.data.success) {
                // Update the user state in Redux with the new data from the API
                dispatch(setUser(res.data.user));
                toast.success("Profile updated successfully!");
                setIsEditingProfile(false); // Exit editing mode on success
            }
        } catch (error) {
            handleAxiosError(error);
        } finally {
            toast.dismiss(toastId);
            setIsSubmitting(false);
        }
    };

    const onSubmitPasswordChange = async (data) => {
        const toastId = toast.loading("Please wait...");
        try {
            const response = await authApis.changePassword(data);
            toast.success("Password changed successfully");
            console.log("Response Of Password Change", response);
        } catch (error) {
            handleAxiosError(error);
        } finally {
            toast.dismiss(toastId);
        }
        setIsChangingPassword(false);
        resetPassword();
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 sm:space-y-8"
            >
                {/* Profile Overview Header */}
                <div className="flex justify-between items-center">
                    <h2 className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl font-semibold uppercase text-foreground tracking-wide">
                        <FiUser size={20} /> Profile Overview
                    </h2>
                </div>

                {/* Profile Picture (Non-editable) */}
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <img
                            src={`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}`}
                            alt="Profile"
                            className="w-24 h-24 object-cover border-2 border-foreground/40"
                        />
                    </div>
                    <div>
                        <p className="text-lg sm:text-xl font-medium text-foreground capitalize">
                            {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-sm sm:text-base text-foreground">
                            Member since{" "}
                            {new Date(user?.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                }
                            )}
                        </p>
                    </div>
                </div>

                {/* Update Profile Section */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="flex items-center gap-2 text-base sm:text-lg font-semibold uppercase text-foreground tracking-wide">
                            <FiUser size={20} /> Update Profile
                        </h3>
                        <button
                            onClick={() => setIsEditingProfile(!isEditingProfile)}
                            className="flex items-center gap-2 bg-foreground text-white px-4 py-2 text-sm uppercase hover:bg-foreground/90 transition-colors duration-200 shadow-md"
                        >
                            {isEditingProfile ? (
                                <>
                                    <FiSave size={16} /> Save
                                </>
                            ) : (
                                <>
                                    <FiEdit size={16} /> Edit Profile
                                </>
                            )}
                        </button>
                    </div>

                    <form
                        onSubmit={handleSubmitProfile(onSubmitProfile)}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 capitalize">
                            <InputField
                                label="First Name"
                                name="firstName"
                                register={registerProfile}
                                errors={profileErrors}
                                rules={{ required: "First name is required" }}
                                readOnly={!isEditingProfile}
                            />
                            <InputField
                                label="Last Name"
                                name="lastName"
                                register={registerProfile}
                                errors={profileErrors}
                                rules={{ required: "Last name is required" }}
                                readOnly={!isEditingProfile}
                            />
                            <InputField
                                label="Email"
                                name="email"
                                type="email"
                                register={registerProfile}
                                errors={profileErrors}
                                rules={{
                                    required: "Email is required",
                                    pattern: {
                                        value: /^\S+@\S+$/i,
                                        message: "Invalid email address",
                                    },
                                }}
                                readOnly={true} // Email should likely not be editable
                            />
                            <InputField
                                label="Phone"
                                name="phone"
                                type="tel"
                                register={registerProfile}
                                errors={profileErrors}
                                rules={{ required: "Phone number is required" }}
                                readOnly={!isEditingProfile}
                            />
                            <InputField
                                label="Gender"
                                name="gender"
                                register={registerProfile}
                                errors={profileErrors}
                                readOnly={!isEditingProfile}
                            />
                            <InputField
                                label="Date of Birth"
                                name="dob"
                                type="date"
                                register={registerProfile}
                                errors={profileErrors}
                                rules={{
                                    required: "Date of birth is required",
                                }}
                                readOnly={!isEditingProfile}
                            />
                        </div>

                        {isEditingProfile && (
                            <Button
                                type="submit"
                                className="bg-foreground text-white px-6 py-2 text-sm uppercase hover:bg-foreground/90 transition-colors duration-200 shadow-md"
                                loading={isSubmitting} // Use the new state to show a loading spinner
                            >
                                Update Profile
                            </Button>
                        )}
                    </form>
                </div>

                {/* Change Password Section */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="flex items-center gap-2 text-base sm:text-lg font-semibold uppercase text-foreground tracking-wide">
                            <FiLock size={20} /> Change Password
                        </h3>
                        <button
                            onClick={() =>
                                setIsChangingPassword(!isChangingPassword)
                            }
                            className="flex items-center gap-2 bg-foreground text-white px-4 py-2 text-sm uppercase hover:bg-foreground/90 transition-colors duration-200 shadow-md"
                        >
                            {isChangingPassword ? (
                                <>
                                    <FiSave size={16} /> Save
                                </>
                            ) : (
                                <>
                                    <FiLock size={16} /> Change Password
                                </>
                            )}
                        </button>
                    </div>

                    {isChangingPassword && (
                        <form
                            onSubmit={handleSubmitPassword(
                                onSubmitPasswordChange
                            )}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                                <InputField
                                    label="Your Current Password"
                                    name="oldPassword"
                                    type="password"
                                    register={registerPassword}
                                    errors={passwordErrors}
                                    rules={{
                                        required: "Current password is required",
                                        minLength: {
                                            value: 6,
                                            message:
                                                "Old Password must be at least 6 characters",
                                        },
                                    }}
                                />
                                <InputField
                                    label="New Password"
                                    name="password"
                                    type="password"
                                    register={registerPassword}
                                    errors={passwordErrors}
                                    rules={{
                                        required: "New password is required",
                                        minLength: {
                                            value: 6,
                                            message:
                                                "Password must be at least 6 characters",
                                        },
                                        validate: (value) =>
                                            value !==
                                            watchPassword("oldPassword") ||
                                            "New password cannot be the same as the old password",
                                    }}
                                />
                                <InputField
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    type="password"
                                    register={registerPassword}
                                    errors={passwordErrors}
                                    rules={{
                                        required: "Confirm password is required",
                                        validate: (value) =>
                                            value ===
                                            watchPassword("password") ||
                                            "Passwords do not match",
                                    }}
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-foreground text-white px-6 py-2 text-sm uppercase hover:bg-foreground/90 transition-colors duration-200 shadow-md"
                            >
                                Update Password
                            </button>
                        </form>
                    )}
                </div>

                {/* ——— Logout Button (opens modal) ——— */}
                <div className="w-fit mx-auto">
                    <button
                        onClick={() => setIsLogoutModalOpen(true)}
                        className="bg-red-600 text-white px-6 py-2 text-sm uppercase hover:bg-red-700 transition-colors duration-200 shadow-md"
                    >
                        Log Out
                    </button>
                </div>
            </motion.div>

            {/* ——— Confirmation Modal ——— */}
            <AnimatePresence>
                {isLogoutModalOpen && (
                    <motion.div
                        key="logout-modal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white  rounded w-11/12 max-w-md p-6"
                        >
                            <h2 className="text-xl font-semibold mb-4 text-foreground">
                                Confirm Logout
                            </h2>
                            <p className="text-sm text-foreground/80 mb-6">
                                Are you sure you want to log out? You will need
                                to sign in again to access your account.
                            </p>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setIsLogoutModalOpen(false)}
                                    className="px-4 py-2 text-sm bg-gray-200 text-gray-700  hover:bg-gray-300 transition-colors duration-150"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        setIsLogoutModalOpen(false);
                                        logOutHandler();
                                    }}
                                    className="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 transition-colors duration-150"
                                >
                                    Yes, Log Out
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default Profile;
