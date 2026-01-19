import ChangePasswordForm from "@/app/dashboard/settings/change-password-form";
import UpdateProfileForm from "@/app/dashboard/settings/update-profile-form";

export default function SettingsPage() {
  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Cài đặt tài khoản</h1>
      <div className="mb-8">
        <UpdateProfileForm />
      </div>
      <div>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
