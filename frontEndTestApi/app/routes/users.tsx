import { Link } from "react-router";
import type { Route } from "./+types/users";
import { useEffect, useState, type FormEvent } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Liste des utilisateurs" },
    { name: "description", content: "Page des utilisateurs" },
  ];
}

type User = {
  id: number;
  name: string;
  email: string;
};

const API_URL = import.meta.env.VITE_API_URL;

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // chargé la liste au montage du composant

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_URL}/users`, { headers });
        if (!res.ok)
          throw new Error("Impossible de récupérer les utilisateurs");
        const data: User[] = await res.json();
        setUsers(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleAddUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers,
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const firstError = data.errors
          ? (Object.values(data.errors)[0] as string[])[0]
          : data.message;
        setError(
          firstError ??
            "Une erreur est survenue lors de l'ajout de l'utilisateur",
        );
        return;
      }

      setUsers([data, ...users]);
      setName("");
      setEmail("");
      setPassword("");
    } catch {
      setError("Impossible de joindre le serveur.");
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error();
      setUsers(users.filter((f) => f.id !== id));
    } catch {
      setError("Impossible de supprimer l'utilisateur.");
    }
  };

  return (
    <main className="flex justify-between items-start gap-2 pt-16 p-4 container mx-auto">
      {/* Liste des utilisateurs */}
      <div className="text-gray-700 bg-amber-50 w-full h-auto p-5 rounded-lg shadow-md relative">
        <h1 className="mb-5">Liste des utilisateurs</h1>
        <Link
          to="/"
          className="text-blue-500 hover:text-blue-700 absolute top-4 right-4"
        >
          Retour à l'accueil
        </Link>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        {loading ? (
          <p className="text-gray-500">Chargement en cours...</p>
        ) : users.length > 0 ? (
          users.map((user, index) => (
            <div
              key={user.id}
              className="flex justify-start items-center gap-2 bg-white h-auto p-4 rounded-lg shadow-sm relative mt-2 w-full"
            >
              <span className="bg-blue-950 text-white px-3 py-1 rounded-full">
                {index + 1}
              </span>
              <p className="text-gray-700">{user.name}</p>
              <span className="text-gray-700 px-3 py-1 rounded-full">|</span>
              <p className="text-gray-700">{user.email}</p>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer absolute right-4"
                onClick={() => handleDeleteUser(user.id)}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 flex justify-center items-center w-full h-full">
            Aucun utilisateur à afficher.
          </p>
        )}
      </div>
      {/* Formulaire pour ajouter un utilisateur */}
      <div className="bg-white text-gray-700 h-full w-100 p-4 rounded-lg shadow-sm">
        <form onSubmit={handleAddUser} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Nom de l'utilisateur"
            className="border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 rounded-2xl"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            name="email"
            placeholder="Email de l'utilisateur"
            className="border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 rounded-2xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            name="password"
            placeholder="Mot de passe de l'utilisateur"
            className="border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 rounded-2xl"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
          >
            Ajouter
          </button>
        </form>
      </div>
    </main>
  );
}
