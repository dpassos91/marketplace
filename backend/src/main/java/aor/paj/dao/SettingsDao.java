package aor.paj.dao;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import aor.paj.entity.SettingsEntity;

@ApplicationScoped
public class SettingsDao {

    @PersistenceContext
    EntityManager em;

    public SettingsEntity getSettings() {
        return em.find(SettingsEntity.class, 1); // ID fixo
    }

    public void save(SettingsEntity settings) {
        em.persist(settings);
    }

    public void update(SettingsEntity settings) {
        em.merge(settings);
    }
}