export default function ChangePasswordForm() {
  return (
    <form className="space-y-4">
      <h2 className="text-lg font-semibold">Đổi mật khẩu</h2>
      <div>
        <label className="block mb-1">Mật khẩu hiện tại</label>
        <input
          type="password"
          className="border rounded px-3 py-2 w-full"
          placeholder="Mật khẩu hiện tại"
        />
      </div>
      <div>
        <label className="block mb-1">Mật khẩu mới</label>
        <input
          type="password"
          className="border rounded px-3 py-2 w-full"
          placeholder="Mật khẩu mới"
        />
      </div>
      <div>
        <label className="block mb-1">Xác nhận mật khẩu mới</label>
        <input
          type="password"
          className="border rounded px-3 py-2 w-full"
          placeholder="Xác nhận mật khẩu mới"
        />
      </div>
      <button type="submit" className="bg-primary text-white px-4 py-2 rounded">
        Đổi mật khẩu
      </button>
    </form>
  );
}
