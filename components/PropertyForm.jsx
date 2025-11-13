// PropertyForm component: Form for creating/editing a property (for agents)
export default function PropertyForm({ property }) {
  // TODO: Implement form fields and submission logic
  return (
    <form className="bg-white p-6 rounded shadow">
      {/* Form fields for property details */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Title</label>
        <input className="border rounded px-3 py-2 w-full" defaultValue={property?.title || ''} />
      </div>
      {/* More fields... */}
      <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Save Property</button>
    </form>
  );
}
