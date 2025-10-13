// app/property/new/page.jsx
export default function NewProperty() {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6">
      <h1 className="text-2xl font-semibold mb-4">Add new property</h1>

      <div className="grid grid-cols-1 gap-4">
        <input placeholder="Title" className="p-3 rounded-lg border" />
        <input placeholder="Price (e.g. ₹12,000 / month)" className="p-3 rounded-lg border" />
        <input placeholder="City" className="p-3 rounded-lg border" />
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="Beds" className="p-3 rounded-lg border" />
          <input placeholder="Baths" className="p-3 rounded-lg border" />
        </div>
        <input placeholder="Area (sqft)" className="p-3 rounded-lg border" />
        <textarea placeholder="Description" className="p-3 rounded-lg border h-32"></textarea>

        <div className="pt-2">
          <div className="inline-block px-5 py-2 bg-indigo-600 text-white rounded-lg">Save property</div>
        </div>
      </div>
    </div>
  );
}
