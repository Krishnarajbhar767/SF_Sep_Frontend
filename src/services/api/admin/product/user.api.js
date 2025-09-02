import axiosInstance from "../../../../utils/apiConnector";
import adminUserEndpoints from "../../../endpoints/admin/product/user.endpoints";

// const adminUserApis = {
//     //  Get all users
//     getAllUsers: async () => {
//         const res = await axiosInstance.get(adminUserEndpoints.getAllUser);
//         return res?.data?.data;
//     },

//     //  Add new user
//     addUser: async (userData) => {
//         const res = await axiosInstance.post(adminUserEndpoints.addUser, userData);
//         return res?.data;
//     },

//     //  Update user
//     updateUser: async (userId, updatedData) => {
//         const res = await axiosInstance.put(`${adminUserEndpoints.updateUser}/${userId}`, updatedData);
//         return res?.data;
//     },

//     //  Delete user
//     deleteUser: async (userId) => {
//         const res = await axiosInstance.delete(`${adminUserEndpoints.deleteUser}/${userId}`);
//         return res?.data;
//     },
// };




const adminUserApis = {
    getAllUsers: async () => {
        const res = await axiosInstance.get("/admin/user/all-user");
        return res?.data?.data;
    },

    addUser: async (payload) => {
        const res = await axiosInstance.post("/admin/user/add-user", payload);
        return res?.data;
    },

    updateUser: async (id, payload) => {
        const res = await axiosInstance.put(`/admin/user/update-user/${id}`, payload);
        return res?.data;
    },

    deleteUser: async (id) => {
        const res = await axiosInstance.delete(`/admin/user/delete-user/${id}`);
        return res?.data;
    },
};




export default adminUserApis;


