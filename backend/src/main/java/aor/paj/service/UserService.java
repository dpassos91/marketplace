package aor.paj.service;

import aor.paj.dto.LoginRequestDto;
import aor.paj.dto.PasswordUpdateDto;
import aor.paj.dto.StatusUpdateDto;
import aor.paj.dto.UserDto;
import aor.paj.entity.UserEntity;
import aor.paj.bean.UserBean;
import jakarta.inject.Inject;
import jakarta.persistence.EntityNotFoundException;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

@Path("/users")
public class UserService {

    private static final Logger logger = LogManager.getLogger(UserService.class);

    @Inject
    UserBean userBean;

    // Criar novo utilizador
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createUser(UserDto userDto) {
        logger.info("Registration attempt by user: {}", userDto.getUsername());
        UserDto createdUser = userBean.registerUser(userDto);
        logger.info("User successfully registered: {}", createdUser.getUsername());
        return Response.ok(createdUser).build();
    }

    // Obter utilizador por ID
    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUser(@PathParam("id") Long id) {
        logger.info("Received a request to view user with id: {}", id);
        return Response.ok(userBean.getUserById(id)).build();
    }

    // Atualizar utilizador
    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateUser(@PathParam("id") Long id, @HeaderParam("token") String token, UserDto userDto) {
        logger.info("Received a request to update user with id: {}", id);
        return userBean.updateUser(id, token, userDto);
    }

    // Apagar utilizador
    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteUser(@PathParam("id") Long id, @HeaderParam("token") String token) {
        logger.info("Received a request to delete user with id: {}", id);
        return userBean.deleteUser(id, token);
    }

    // Atualizar status do utilizador (ativar/suspender)
    @PATCH
    @Path("/{id}/status")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateUserStatus(@PathParam("id") Long id, @HeaderParam("token") String token, StatusUpdateDto statusUpdate) {
        logger.info("Received a request to update status for user with id: {}", id);
        if (statusUpdate.isActive()) {
            return userBean.activateUser(id, token);
        } else {
            return userBean.suspendUser(id, token);
        }
    }

    // Buscar por username
    @GET
    @Path("/username/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserByUsername(@PathParam("username") String username) {
        logger.info("Received a request to fetch a user by its username: {}", username);
        try {
            return Response.ok(userBean.getUserByUsername(username)).build();
        } catch (EntityNotFoundException exception) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("User with username " + username + " not found!")
                    .build();
        }
    }

    // Listar todos os utilizadores
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllUsers(@QueryParam("active") Boolean active) {
        logger.info("Received a request to fetch users. Active filter: {}", active);
        if (active != null && active) {
            return Response.ok(userBean.getAllActiveUsers()).build();
        }
        return Response.ok(userBean.getAllUsers()).build();
    }

    // Listar todos os utilizadores apagados (apenas para admin)
    @GET
    @Path("/deleted")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllDeletedUsers(@HeaderParam("token") String token) {
        logger.info("Received a request to fetch all deleted users with token: {}", token);

        // Autorização (por ex., só admin pode ver apagados)
        UserEntity user = userBean.getUserByToken(token);
        System.out.println(">> [CONFIRMAR] Utilizador encontrado: " + (user != null ? user.getUsername() : "null"));
        if (user == null || !user.isAdmin()) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("401: Unauthorized access.").build();
        }

        return Response.ok(userBean.getAllDeletedUsers()).build();
    }

    @PATCH
@Path("/{id}/password")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public Response updatePassword(
    @PathParam("id") Long id,
    @HeaderParam("token") String token,
    PasswordUpdateDto passwordUpdateDto
) {
    logger.info("Password update requested for user ID: {}", id);
    return userBean.updatePassword(id, token, passwordUpdateDto);
}

@POST
@Path("/confirm")
public Response confirmAccount(@QueryParam("token") String token) {
    System.out.println(">> [CONFIRMAR] Token recebido: " + token);
    if (token == null || token.isEmpty()) {
        return Response.status(Response.Status.BAD_REQUEST)
                .entity("Token de confirmação em falta.")
                .build();
    }

    UserEntity user = userBean.findByConfirmationToken(token);
    if (user == null) {
        return Response.status(Response.Status.NOT_FOUND)
                .entity("Token inválido ou conta já confirmada.")
                .build();
    }

    if (user.isConfirmed()) {
        return Response.status(Response.Status.CONFLICT)
                .entity("Conta já confirmada anteriormente.")
                .build();
    }

    user.setConfirmed(true);
    user.setConfirmationToken(null); // limpa o token
    userBean.updateUser(user); // garante persistência

    return Response.ok("Conta confirmada com sucesso!").build();
}

}
