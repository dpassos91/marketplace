package aor.paj.service;

import aor.paj.bean.PasswordResetTokenBean;
import aor.paj.dto.PasswordResetTokenRequestDto;
import aor.paj.dto.PasswordResetTokenDto;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

@Path("/auth")
public class PasswordResetTokenService {

    private static final Logger logger = LogManager.getLogger(PasswordResetTokenService.class);

    @Inject
    PasswordResetTokenBean passwordResetTokenBean;

    @POST
    @Path("/request-password-reset")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response requestReset(PasswordResetTokenRequestDto requestDto) {
        logger.info("Pedido de recuperação de password recebido para: {}", requestDto.getEmail());
        try {
            String token = passwordResetTokenBean.generateResetToken(requestDto.getEmail());
            return Response.ok("{\"token\": \"" + token + "\"}").build();
        } catch (IllegalArgumentException e) {
            logger.warn("Pedido de recuperação rejeitado: {}", e.getMessage());
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
    }
    

    @POST
    @Path("/reset-password")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response resetPassword(PasswordResetTokenDto resetDto) {
        logger.info("Resetting password using token: {}", resetDto.getToken());
        try {
            passwordResetTokenBean.resetPassword(resetDto.getToken(), resetDto.getNewPassword());
            return Response.ok("Password atualizada com sucesso!").build();
        } catch (IllegalStateException e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
    }
}
