import React, { useState, useEffect } from "react";
import { useIntl, FormattedMessage } from "react-intl";
import SpinnerLeaf from "../components/commons/SpinnerLeaf";
import settingsAPI from "../api/settingsAPI"; // Adjust the import path as necessary

function AdminSettingsPage() {
  const intl = useIntl();
  const [settings, setSettings] = useState({
    sessionTimeoutMinutes: "",
    resetTokenTimeoutMinutes: "",
    confirmTokenTimeoutMinutes: ""
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await settingsAPI.getSettings();
        setSettings(response);
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
        alert(intl.formatMessage({ id: "admin.settings.errorLoad", defaultMessage: "Erro ao carregar configurações." }));
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, [intl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await settingsAPI.updateSettings(settings);
      alert(intl.formatMessage({ id: "admin.settings.success", defaultMessage: "Configurações atualizadas com sucesso!" }));
    } catch (error) {
      console.error("Erro ao atualizar configurações:", error);
      alert(intl.formatMessage({ id: "admin.settings.errorUpdate", defaultMessage: "Erro ao atualizar configurações." }));
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <SpinnerLeaf />
      </div>
    );
  }

  return (
    <main className="p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-6">⚙️ {intl.formatMessage({ id: "admin.settings.title", defaultMessage: "Configurações" })}</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-2xl p-6 space-y-4 max-w-xl mx-auto">
        <div>
          <label className="block mb-1 font-semibold">
            {intl.formatMessage({ id: "admin.settings.sessionTimeout", defaultMessage: "Tempo de sessão (minutos)" })}
          </label>
          <input
            type="number"
            name="sessionTimeoutMinutes"
            value={settings.sessionTimeoutMinutes}
            onChange={handleChange}
            className="border rounded p-2 w-full text-center"
            min="1"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">
            {intl.formatMessage({ id: "admin.settings.resetTokenTimeout", defaultMessage: "Tempo de expiração do reset token (minutos)" })}
          </label>
          <input
            type="number"
            name="resetTokenTimeoutMinutes"
            value={settings.resetTokenTimeoutMinutes}
            onChange={handleChange}
            className="border rounded p-2 w-full text-center"
            min="1"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">
            {intl.formatMessage({ id: "admin.settings.confirmTokenTimeout", defaultMessage: "Tempo de expiração do token de confirmação (minutos)" })}
          </label>
          <input
            type="number"
            name="confirmTokenTimeoutMinutes"
            value={settings.confirmTokenTimeoutMinutes}
            onChange={handleChange}
            className="border rounded p-2 w-full text-center"
            min="1"
          />
        </div>

        <button
          type="submit"
          className="bg-[var(--primary-color)] text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-[var(--primary-400)] transition duration-300"
        >
          {isSaving ? (
            <FormattedMessage id="admin.settings.saving" defaultMessage="A atualizar..." />
          ) : (
            <FormattedMessage id="admin.settings.save" defaultMessage="Atualizar configurações" />
          )}
        </button>
      </form>
    </main>
  );
}

export default AdminSettingsPage;

