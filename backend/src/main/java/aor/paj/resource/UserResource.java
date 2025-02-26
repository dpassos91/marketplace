package aor.paj.resource;

import java.util.HashMap;
import java.util.Map;

import aor.paj.dto.UserDto;
import aor.paj.service.UserService;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/users")
public class UserResource {

    @Inject
    UserService userService;

    @POST
    @Path("/register")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response registerUser(UserDto userDto) {
        UserDto createdUser = userService.registerUser(userDto);
        return Response.ok(createdUser).build();
    }

    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response loginUser(@HeaderParam("Username") String username,
            @HeaderParam("Password") String password) {
        try {
            UserDto loggedInUser = userService.loginUser(username, password);
            return Response.ok(loggedInUser).build();
        } catch (RuntimeException e) {
            return Response.status(Response.Status.UNAUTHORIZED).entity(
                    "Credenciais Inválidas!").build();
        }
    }

    @GET
    @Path("/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUser(@PathParam("username") String username) {
        UserDto userDto = userService.getUserByUsername(username);
        return Response.ok(userDto).build();
    }

    @DELETE
    @Path("/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteUser(@PathParam("username") String username) {
        userService.deleteUserByUsername(username);
        return Response.noContent().build();
    }

    @GET
    @Path("/check-username")
    @Produces(MediaType.APPLICATION_JSON)
    public Response checkUsernameExists(@QueryParam("username") String username) {
        boolean exists = userService.checkUsernameExists(username);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return Response.ok(response).build();
    }

    @PUT
    @Path("/{username}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateUser(@PathParam("username") String username, UserDto updatedUser) {
        try {
            UserDto user = userService.updateUser(username, updatedUser);
            return Response.ok(user).build();
        } catch (RuntimeException e) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Erro ao atualizar os dados do usuário.")
                    .build();
        }
    }
}