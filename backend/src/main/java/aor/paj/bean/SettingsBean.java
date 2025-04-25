package aor.paj.bean;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import aor.paj.dao.SettingsDao;
import aor.paj.entity.SettingsEntity;

@ApplicationScoped
public class SettingsBean {

    @Inject
    private SettingsDao settingsDao;

    public int getSessionTimeoutMinutes() {
        return settingsDao.getSettings().getSessionTimeoutMinutes();
    }

    public int getResetTokenTimeoutMinutes() {
        return settingsDao.getSettings().getResetTokenTimeoutMinutes();
    }

    public int getConfirmTokenTimeoutMinutes() {
        return settingsDao.getSettings().getConfirmTokenTimeoutMinutes();
    }

    public void updateAllTimeouts(int session, int reset, int confirm) {
    SettingsEntity settings = settingsDao.getSettings();
    settings.setSessionTimeoutMinutes(session);
    settings.setResetTokenTimeoutMinutes(reset);
    settings.setConfirmTokenTimeoutMinutes(confirm);
    settingsDao.update(settings);
}

}

