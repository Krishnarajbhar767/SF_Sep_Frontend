export default function BlogTable({ blogs, onEdit, onDelete }) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border rounded-lg shadow">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-3 text-left">Title</th>
                        <th className="p-3 text-left">Slug</th>
                        <th className="p-3 text-left">Created</th>
                        <th className="p-3 text-left">Cover</th>
                        <th className="p-3 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {blogs.map((b) => (
                        <tr key={b._id} className="border-t hover:bg-gray-50">
                            <td className="p-3">{b.title}</td>
                            <td className="p-3">{b.slug}</td>
                            <td className="p-3">
                                {new Date(b.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-3">
                                {b.coverImage ? (
                                    <img
                                        src={b.coverImage}
                                        alt={b.title}
                                        className="w-16 h-12 object-cover rounded"
                                    />
                                ) : (
                                    "—"
                                )}
                            </td>
                            <td className="p-3 flex gap-2 justify-center">
                                <button
                                    onClick={() => onEdit(b)}
                                    className="px-2 py-1  text-white rounded bg-gray-900 hover:bg-gray-800"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDelete(b._id)}
                                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
