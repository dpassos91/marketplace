package aor.paj.init;

import aor.paj.dao.SettingsDao;
import aor.paj.dao.UserDao;
import aor.paj.entity.SettingsEntity;
import aor.paj.entity.UserEntity;
import aor.paj.bean.UserBean;
import jakarta.annotation.PostConstruct;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import jakarta.ejb.Singleton;
import jakarta.ejb.Startup;	

import java.time.LocalDate;

@Singleton
@Startup
public class SettingsInitializer {

    @Inject
    SettingsDao settingsDao;

    @Inject
    UserDao userDao;

    @Inject
    UserBean userBean;

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

        if (userDao.countAdmins() == 0) {
            UserEntity admin = new UserEntity();
            admin.setUsername("admin");
            admin.setEmail("admin@admin.com");
            admin.setFirstName("Administrador");
            admin.setLastName("Sistema");
            admin.setPhone("911111111");
            admin.setPicture("https://cptstatic.s3.amazonaws.com/imagens/enviadas/materias/materia25719/administrador-de-empresas-uma-unica-pessoa-em-varios-papeis-artigos-cursos-cpt.jpg");
            admin.setPassword(userBean.hashPassword("admin123")); // usa método do bean
            admin.setAdmin(true);
            admin.setConfirmed(true);
            admin.setActive(true);
            admin.setCreatedAt(LocalDate.now());


            userDao.create(admin);

            System.out.println("🛡️ Administrador criado automaticamente:");
        }
    }
}

