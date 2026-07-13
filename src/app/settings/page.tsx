import { SettingsForm } from "@/src/presentation/settings/settings-form";

export default function SettingsPage() {
  return (
    <div className="destination-page settings-page">
      <header className="destination-header">
        <p className="eyebrow">System · Phase 01</p>
        <h1>Settings</h1>
        <p>
          Control workspace defaults and personal experience preferences from
          one typed foundation.
        </p>
      </header>
      <SettingsForm />
    </div>
  );
}
