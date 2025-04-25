package aor.paj.service;

import aor.paj.bean.SettingsBean;
import aor.paj.dto.SettingsDto;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/settings")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class SettingsService {

    @Inject
    SettingsBean settingsBean;

    @GET
    public Response getSettings() {
        SettingsDto dto = new SettingsDto();
        dto.setSessionTimeoutMinutes(settingsBean.getSessionTimeoutMinutes());
        dto.setResetTokenTimeoutMinutes(settingsBean.getResetTokenTimeoutMinutes());
        dto.setConfirmTokenTimeoutMinutes(settingsBean.getConfirmTokenTimeoutMinutes());

        return Response.ok(dto).build();
    }

    @PUT
    public Response updateSettings(SettingsDto dto) {
        settingsBean.updateAllTimeouts(
            dto.getSessionTimeoutMinutes(),
            dto.getResetTokenTimeoutMinutes(),
            dto.getConfirmTokenTimeoutMinutes()
        );
        return Response.ok("Configurações atualizadas com sucesso.").build();
    }
}
