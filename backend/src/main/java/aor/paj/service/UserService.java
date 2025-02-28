package aor.paj.service;

import java.util.HashMap;
import java.util.Map;

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
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/users")
public class UserService {

    @Inject
    UserBean userBean;

    @POST
    @Path("/register")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response registerUser(UserDto userDto) {
        UserDto createdUser = userBean.registerUser(userDto);
        return Response.ok(createdUser).build();
    }

    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response logIn(LoginRequestDto user){
        String token = userBean.logIn(user);
        if(token != null){
            return Response.status(200).entity(token).build();
        }
        return Response.status(403).entity("Invalid Username or Password!").build();
    }

    @POST
    @Path("/logout")
    public Response logout(@HeaderParam("token") String token){
        if (userBean.logOut(token)) {
            return Response.status(200).entity("Successfully logged out!").build();
        }
        return Response.status(401).entity("Invalid Token!").build();
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUser(@PathParam("id") Long id) {
        UserDto user = userBean.getUserById(id);
        return Response.ok(user).build();
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateUser(@PathParam("id") Long id, UserDto userDto) {
        try {
            UserDto user = userBean.updateUser(id, userDto);
            return Response.ok(user).build();
        } catch (EntityNotFoundException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(e.getMessage())
                    .build();
        }
    }

    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteUser(@PathParam("id") Long id) {
        boolean deleted = userBean.deleteUser(id);

        if (deleted) {
            return Response.ok().entity("User deleted successfully").build();
        } else {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("User with ID " + id + " not found!")
                    .build();
        }
    }

    private boolean verifyActiveUser(String token) {
        return false;
    }

    private boolean verifyAdmin(String token) {
        return false;
    }

    // TODO: métodos do projeto 2
    /*
    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response loginUser(@HeaderParam("Username") String username,
            @HeaderParam("Password") String password) {
        try {
            UserDto loggedInUser = userBean.loginUser(username, password);
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
        UserDto userDto = userBean.getUserByUsername(username);
        return Response.ok(userDto).build();
    }

    @DELETE
    @Path("/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteUser(@PathParam("username") String username) {
        userBean.deleteUserByUsername(username);
        return Response.noContent().build();
    }

    @GET
    @Path("/check-username")
    @Produces(MediaType.APPLICATION_JSON)
    public Response checkUsernameExists(@QueryParam("username") String username) {
        boolean exists = userBean.checkUsernameExists(username);
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
            UserDto user = userBean.updateUser(username, updatedUser);
            return Response.ok(user).build();
        } catch (RuntimeException e) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Erro ao atualizar os dados do usuário.")
                    .build();
        }
    }
    */
}