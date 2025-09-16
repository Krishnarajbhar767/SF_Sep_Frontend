import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/apiConnector";
import AdminModerateItem from "./AdminModerateItem";
import AdminReplyItem from "./AdminReplyItem";
import Loader from "../../../components/common/Loader";

export default function AdminCommentsDashboard() {
    const [pendingComments, setPendingComments] = useState([]);
    const [approvedComments, setApprovedComments] = useState([]);
    const [loading, setLoading] = useState(true);

    const [nameQuery, setNameQuery] = useState("");
    const [commentQuery, setCommentQuery] = useState("");

    const fetchComments = async () => {
        setLoading(true);
        try {
            const { data } = await axiosInstance.get("/comments/all"); // single call
            setPendingComments(data.data.pending || []);
            setApprovedComments(data.data.approved || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    // Filter function for comments
    const filterComments = (comments) => {
        return comments.filter((c) => {
            const name = `${c.author.firstName} ${c.author.lastName}`.toLowerCase();
            const text = c.comment.toLowerCase();

            const nameMatch = nameQuery
                .toLowerCase()
                .split(" ")
                .filter(Boolean)
                .every((word) => name.includes(word));

            const commentMatch = commentQuery
                .toLowerCase()
                .split(" ")
                .filter(Boolean)
                .every((word) => text.includes(word));

            return nameMatch && commentMatch;
        });
    };

    const filteredPending = filterComments(pendingComments);
    const filteredApproved = filterComments(approvedComments);

    if (loading)
        return <Loader />;

    return (
        <div className="max-w-6xl mx-auto md:p-6 space-y-12">
            {/* Search Inputs */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by author name"
                    value={nameQuery}
                    onChange={(e) => setNameQuery(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full md:w-1/2"
                />
                <input
                    type="text"
                    placeholder="Search by comment text"
                    value={commentQuery}
                    onChange={(e) => setCommentQuery(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full md:w-1/2"
                />
            </div>

            {/* Pending Comments */}
            <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Pending Comments</h2>
                {filteredPending.length === 0 ? (
                    <p className="text-gray-500">No pending comments.</p>
                ) : (
                    <ul className="flex flex-col gap-4">
                        {filteredPending.map((comment) => (
                            <AdminModerateItem
                                key={comment._id}
                                comment={comment}
                                fetchComments={fetchComments}
                            />
                        ))}
                    </ul>
                )}
            </section>

            {/* Approved Comments */}
            <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Approved Comments</h2>
                {filteredApproved.length === 0 ? (
                    <p className="text-gray-500">No approved comments.</p>
                ) : (
                    <ul className="flex flex-col gap-4">
                        {filteredApproved.map((comment) => (
                            <AdminReplyItem
                                key={comment._id}
                                comment={comment}
                                fetchComments={fetchComments}
                                allowDelete={true}
                            />
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}
