import { Link } from "react-router-dom";

export default function UsersPage() {
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const users = JSON.parse(localStorage.getItem("users") || "[]");

  // On enlève l'utilisateur connecté de la liste
  const otherUsers = users.filter((u: any) => u.email !== currentUser?.email);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Utilisateurs</h1>
      {otherUsers.length === 0 ? (
        <p className="text-gray-500">Aucun autre utilisateur inscrit.</p>
      ) : (
        <ul className="space-y-3">
          {otherUsers.map((u: any, index: number) => (
            <li
              key={index}
              className="flex items-center justify-between p-3 bg-white rounded shadow"
            >
              <div className="flex items-center gap-3">
                <img
                  src={u.profileImage || "https://i.pravatar.cc/100"}
                  alt={`${u.firstName} ${u.lastName}`}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="font-medium">
                  {u.firstName} {u.lastName}
                </span>
              </div>
              <Link
                to={`/chat/${u.email}`}
                className="px-3 py-1.5  text-white rounded btn btn-soft btn-warning hover:--color-info-content text-sm"
              >
                Discuter
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
