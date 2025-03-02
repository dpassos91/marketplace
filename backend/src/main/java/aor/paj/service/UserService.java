package aor.paj.service;

import aor.paj.dto.LoginRequestDto;
import aor.paj.dto.UserDto;
import aor.paj.bean.UserBean;
import jakarta.inject.Inject;
import jakarta.persistence.EntityNotFoundException;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

@Path("/users")
public class UserService {

    private static final Logger logger = LogManager.getLogger(UserService.class);

    @Inject
    UserBean userBean;

    @POST
    @Path("/register")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response registerUser(UserDto userDto) {
        logger.info("Registration attempt by user: {}", userDto.getUsername());
        UserDto createdUser = userBean.registerUser(userDto);

        logger.info("User successfully registered: {}", createdUser.getUsername());
        return Response.ok(createdUser).build();
    }

    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response logIn(LoginRequestDto user){
        logger.info("Login attempt by user: {}", user.getUsername());

        String token = userBean.logIn(user);
        if(token != null){
            logger.info("Successful login by user: {}", user.getUsername());
            return Response.status(200).entity(token).build();
        }
        logger.warn("Failed login attempt by user: {}", user.getUsername());
        return Response.status(403).entity("Invalid Username or Password!").build();
    }

    @POST
    @Path("/logout")
    public Response logout(@HeaderParam("token") String token){
        logger.info("Logout attempt with token: {}", token);

        if (userBean.logOut(token)) {
            logger.info("Successful logout with token: {}", token);
            return Response.status(200).entity("Successfully logged out!").build();
        }
        logger.warn("Failed logout attempt with token: {}", token);
        return Response.status(401).entity("Invalid Token!").build();
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUser(@PathParam("id") Long id) {
        logger.info("View attempt of user with id: {}", id);

        UserDto user = userBean.getUserById(id);

        logger.info("Successful view of user with id: {}", id);
        return Response.ok(user).build();
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateUser(@PathParam("id") Long id, @HeaderParam("token") String token, UserDto userDto) {
        logger.info("Update attempt of user with id: {}", id);

        try {
            if (!userBean.isAuthorized(id, token)) {
                logger.warn("Unauthorized attempt of updating user with id: {}", id);
                return Response.status(Response.Status.FORBIDDEN)
                        .entity("You're not allowed to update this user.")
                        .build();
            }
            UserDto user = userBean.updateUser(id, userDto);

            logger.info("Successful update of user with id: {}", id);
            return Response.ok(user).build();
        } catch (EntityNotFoundException exception) {
            logger.error("User with id: {} not found!", id);
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(exception.getMessage())
                    .build();
        }
    }

    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteUser(@PathParam("id") Long id, @HeaderParam("token") String token) {
        logger.info("Delete attempt of user with id: {}", id);
        boolean deleted = userBean.deleteUser(id, token);

        if (deleted) {
            logger.info("Successful deletion of user with id: {}", id);
            return Response.ok().entity("User deleted successfully").build();
        } else {
            logger.warn("Failed deletion of user with id: {}", id);
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("User with ID " + id + " not found!")
                    .build();
        }
    }

}