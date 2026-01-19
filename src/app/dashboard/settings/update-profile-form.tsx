export default function UpdateProfileForm() {
  return (
    <form className="space-y-4">
      <h2 className="text-lg font-semibold">Cập nhật thông tin cá nhân</h2>
      {/* Add fields for name, email, etc. */}
      <div>
        <label className="block mb-1">Tên</label>
        <input
          type="text"
          className="border rounded px-3 py-2 w-full"
          placeholder="Tên của bạn"
        />
      </div>
      <div>
        <label className="block mb-1">Email</label>
        <input
          type="email"
          className="border rounded px-3 py-2 w-full"
          placeholder="Email"
        />
      </div>
      <button type="submit" className="bg-primary text-white px-4 py-2 rounded">
        Lưu thay đổi
      </button>
    </form>
  );
}
