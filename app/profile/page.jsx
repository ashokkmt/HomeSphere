// app/profile/page.jsx
export default function Profile() {
  const user = { name: "Asha Kumar", email: "asha@example.com", role: "User", joined: "2024-09-12" };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6">
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl">
          {user.name.charAt(0)}
        </div>

        <div>
          <div className="text-xl font-semibold">{user.name}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
          <div className="text-sm text-gray-500 mt-1">Member since {user.joined}</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg text-center">Role <div className="font-medium mt-1">{user.role}</div></div>
        <div className="p-4 bg-gray-50 rounded-lg text-center">Listings <div className="font-medium mt-1">3</div></div>
        <div className="p-4 bg-gray-50 rounded-lg text-center">Favorites <div className="font-medium mt-1">5</div></div>
      </div>
    </div>
  );
}
