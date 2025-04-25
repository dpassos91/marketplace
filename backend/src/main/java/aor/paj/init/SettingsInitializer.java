package aor.paj.init;

import aor.paj.dao.SettingsDao;
import aor.paj.entity.SettingsEntity;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class SettingsInitializer {

    @Inject
    SettingsDao settingsDao;

    @Transactional
    @PostConstruct
    public void init() {
        if (settingsDao.getSettings() == null) {
            SettingsEntity settings = new SettingsEntity();
            settings.setId(1); // ID fixo
            settings.setSessionTimeoutMinutes(30);
            settings.setResetTokenTimeoutMinutes(15);
            settings.setConfirmTokenTimeoutMinutes(60);

            settingsDao.save(settings);
            System.out.println("⚙️ Configuração de sessão criada com valores por omissão.");
        } else {
            System.out.println("⚙️ Configuração de sessão já existe.");
        }
    }
}
