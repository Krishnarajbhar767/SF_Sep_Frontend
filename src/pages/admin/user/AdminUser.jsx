// src/pages/admin/users/AdminUsers.jsx
import { useForm } from "react-hook-form";
import { FiUsers, FiEdit, FiTrash, FiX, FiPlus } from "react-icons/fi";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import InputField from "../../../components/common/InputField";
import { toast } from "react-hot-toast";
import adminUserApis from "../../../services/api/admin/product/user.api";

// 🔹 Skeleton Component
const UserSkeleton = () => {
    return (
        <div className="bg-white border border-gray-200 rounded-md shadow-sm p-4 animate-pulse space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            <div className="flex justify-between mt-3">
                <div className="h-6 w-14 bg-gray-300 rounded"></div>
                <div className="h-6 w-14 bg-gray-300 rounded"></div>
            </div>
        </div>
    );
};

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [deleteUserId, setDeleteUserId] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    useEffect(() => {
        (async () => {
            try {
                const data = await adminUserApis.getAllUsers();
                console.log("Fetched users:", data);
                setUsers(data);
            } catch (err) {
                toast.error("Failed to load users");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const onSubmit = handleSubmit(async (formData) => {
        const toastId = toast.loading("Please wait...");

        try {
            let updatedList;
            if (editUser) {
                updatedList = await adminUserApis.updateUser(
                    editUser._id,
                    formData
                );
            } else {
                updatedList = await adminUserApis.addUser(formData);
            }
            setUsers(updatedList);

            const freshList = await adminUserApis.getAllUsers();
            setUsers(freshList);
            toast.success(editUser ? "User updated" : "User added");
            setIsModalOpen(false);
            setEditUser(null);
            reset();
        } catch (err) {
            toast.error("Operation failed");
        } finally {
            toast.dismiss(toastId);
        }
    });

    const onEditUser = (user) => {
        setEditUser(user);
        reset({
            firstName: user.firstName,
            lastName: user.lastName,
            dob: user.dob,
            email: user.email,
            phone: user.phone,
            role: user.role,
            avatar: user.avatar,
        });
        setIsModalOpen(true);
    };

    const confirmDelete = async (id) => {
        console.log("Are you sure you want to delete this user?", id);
        const toastId = toast.loading("Deleting...", id);
        try {
            const updatedList = await adminUserApis.deleteUser(id);
            setUsers(updatedList);
            toast.success("User deleted");
            setDeleteUserId(null);
        } catch {
            toast.error("Delete failed");
        } finally {
            toast.dismiss(toastId);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="flex items-center gap-2 text-xl font-semibold uppercase text-gray-800 tracking-wide">
                    <FiUsers size={20} /> Users
                </h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gray-800 text-white px-4 py-2 text-sm uppercase hover:bg-gray-700 transition-colors duration-200 shadow-md w-full sm:w-auto flex items-center gap-2"
                >
                    <FiPlus size={16} /> Add User
                </button>
            </div>

            {/* User List */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <UserSkeleton key={i} />
                    ))}
                </div>
            ) : users?.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-600 text-sm">No users available.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                    {Array.isArray(users) && users.length > 0 ? (
                        users.map((user) => (
                            <motion.div
                                key={user._id}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white border border-gray-200 rounded-md shadow-sm p-4 flex flex-col gap-2"
                            >
                                <h3 className="text-base font-medium text-gray-800 capitalize">
                                    {`${user.firstName} ${user.lastName}`}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Email: {user.email}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Phone: {user.phone}
                                </p>
                                <p className="text-sm text-gray-600">
                                    DOB: {user.dob ? new Date(user.dob).toLocaleDateString() : "N/A"}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Role: {user.role}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Joined:{" "}
                                    {
                                        new Date(user.createdAt)
                                            .toISOString()
                                            .split("T")[0]
                                    }
                                </p>
                                <div className="flex justify-between mt-2">
                                    <button
                                        onClick={() => onEditUser(user)}
                                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                                    >
                                        <FiEdit size={14} /> Edit
                                    </button>
                                    <button
                                        onClick={() => setDeleteUserId(user._id)}
                                        className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm"
                                    >
                                        <FiTrash size={14} /> Delete
                                    </button>
                                </div>
                            </motion.div>
                        )
                        )) : (
                        <div className="col-span-3 text-center text-gray-600">
                            No users found.
                        </div>
                    )
                    }
                </div>
            )}

            {/* Add/Edit Modal */}
            <div
                className={`glass h-screen fixed inset-0 bg-opacity-30 flex items-center justify-center z-50 p-4 sm:p-6 overflow-y-hidden ${isModalOpen ? "" : "hidden"
                    }`}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white bg-opacity-50 backdrop-blur-md p-4 sm:p-6 w-full max-w-md sm:max-w-lg my-4 sm:my-0 shadow-lg border border-gray-300 border-opacity-20 rounded-lg relative overflow-y-scroll h-[90%]"
                >
                    <button
                        onClick={() => {
                            setIsModalOpen(false);
                            setEditUser(null);
                            reset();
                        }}
                        className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                    >
                        <FiX size={20} />
                    </button>
                    <h3 className="text-lg font-semibold uppercase text-gray-800 mb-4 tracking-wide">
                        {editUser ? "Edit User" : "Add User"}
                    </h3>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <InputField
                            label="First Name"
                            name="firstName"
                            register={register}
                            errors={errors}
                            rules={{ required: "First name is required" }}
                        />
                        <InputField
                            label="Last Name"
                            name="lastName"
                            register={register}
                            errors={errors}
                            rules={{ required: "Last name is required" }}
                        />
                        <InputField
                            label="Date of Birth"
                            name="dob"
                            type="date"
                            register={register}
                            errors={errors}
                        />
                        <InputField
                            label="Email"
                            name="email"
                            type="email"
                            register={register}
                            errors={errors}
                            rules={{ required: "Email is required" }}
                        />
                        <InputField
                            label="Phone"
                            name="phone"
                            register={register}
                            errors={errors}
                            rules={{
                                required: "Phone is required",
                                pattern: {
                                    value: /^[1-9][0-9]{9}$/,
                                    message: "Enter a valid 10-digit phone",
                                },
                            }}
                        />
                        <InputField
                            label="Role"
                            name="role"
                            register={register}
                            errors={errors}
                            rules={{ required: "Role is required" }}
                        />
                        <InputField
                            label="Avatar URL"
                            name="avatar"
                            register={register}
                            errors={errors}
                        />
                        <div className="flex flex-wrap gap-3">
                            <button
                                type="submit"
                                className="bg-gray-800 text-white px-4 py-2 text-sm uppercase hover:bg-gray-700 transition-colors duration-200 shadow-md w-full sm:w-auto"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setEditUser(null);
                                    reset();
                                }}
                                className="bg-gray-200 text-gray-800 px-4 py-2 text-sm uppercase hover:bg-gray-300 transition-colors duration-200 shadow-md w-full sm:w-auto"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>

            {/* Delete Confirmation Modal */}
            <div
                className={`glass fixed inset-0 bg-opacity-30 flex items-center justify-center z-50 p-4 ${deleteUserId ? "" : "hidden"
                    }`}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white bg-opacity-50 backdrop-blur-md p-4 sm:p-6 w-full max-w-sm shadow-lg border border-gray-300 border-opacity-20 rounded-lg"
                >
                    <h3 className="text-lg font-semibold uppercase text-gray-800 mb-4 tracking-wide">
                        Confirm Deletion
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                        Are you sure you want to delete this user? This action
                        cannot be undone.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => confirmDelete(deleteUserId)}
                            className="bg-red-600 text-white px-4 py-2 text-sm uppercase hover:bg-red-700 transition-colors duration-200 shadow-md w-full sm:w-auto"
                        >
                            Delete
                        </button>
                        <button
                            onClick={() => setDeleteUserId(null)}
                            className="bg-gray-200 text-gray-800 px-4 py-2 text-sm uppercase hover:bg-gray-300 transition-colors duration-200 shadow-md w-full sm:w-auto"
                        >
                            Cancel
                        </button>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

export default AdminUsers;
