package aor.paj.service;

import aor.paj.bean.UserBean;
import aor.paj.dto.LoginRequestDto;
import aor.paj.dto.LoginResponseDto;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

@Path("/auth")
public class AuthService {

    private static final Logger logger = LogManager.getLogger(AuthService.class);

    @Inject
    UserBean userBean;

    @POST
@Path("/login")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public Response logIn(LoginRequestDto user) {
    logger.info("Login attempt by user: {}", user.getUsername());

    try {
        LoginResponseDto loginResponse = userBean.logIn(user);

        if (loginResponse != null) {
            logger.info("Successful login by user: {}", user.getUsername());
            return Response.ok(loginResponse).build();
        }

        logger.warn("Failed login attempt by user: {}", user.getUsername());
        return Response.status(Response.Status.FORBIDDEN)
                .entity("Invalid Username or Password!").build();

    } catch (SecurityException e) {
        // ⚠️ Conta não confirmada
        logger.warn("Login blocked for unconfirmed user: {}", user.getUsername());
        return Response.status(Response.Status.FORBIDDEN)
                .entity(e.getMessage())
                .build();
    }
}

    @POST
    @Path("/logout")
    public Response logout(@HeaderParam("token") String token) {
        logger.info("Logout attempt with token: {}", token);
        if (userBean.logOut(token)) {
            logger.info("Successful logout with token: {}", token);
            return Response.status(200).entity("Successfully logged out!").build();
        }
        logger.warn("Failed logout attempt with token: {}", token);
        return Response.status(401).entity("Invalid Token!").build();
    }
}

