package aor.paj.bean;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

import aor.paj.dao.UserDao;
import aor.paj.dto.LoginRequestDto;
import aor.paj.dto.UserDto;
import aor.paj.entity.UserEntity;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityNotFoundException;
import jakarta.ws.rs.core.Response;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.mindrot.jbcrypt.BCrypt;

@ApplicationScoped
public class UserBean {

    private static final Logger logger = LogManager.getLogger(UserBean.class);

    @Inject
    private UserDao userDao;

    public UserDto registerUser(UserDto userDto) {
        if (!isValidUsername(userDto.getUsername())) {
            logger.warn("Username already in use: {}", userDto.getUsername());
            throw new IllegalArgumentException("Username already in use");
        }

        UserEntity userEntity = toEntity(userDto);

        userEntity.setPassword(hashPassword(userDto.getPassword()));
        userEntity.setActive(true);
        userEntity.setAdmin(false);

        try {
            userEntity = userDao.create(userEntity);
            logger.info("User successfully registered: {}", userDto.getUsername());
        } catch (Exception exception) {
            logger.error("Error during registration for user: {}", userDto.getUsername(), exception);
            throw exception;
        }

        return toDto(userEntity);
    }

    private boolean isValidUsername(String username) {
        List<String> allUsername = userDao.findAllUsername();

        for (String existingUsername : allUsername) {
            if (existingUsername.equals(username)) {
                return false;
            }
        }
        return true;
    }

    public String hashPassword(String password) {
        return BCrypt.hashpw(password, BCrypt.gensalt());
    }

    public String logIn(LoginRequestDto user) {
        UserEntity userEntity = userDao.findByUsername(user.getUsername());
        if (userEntity != null && userEntity.isActive()) {
            if (userEntity.checkPassword(user.getPassword())) {
                String token = generateNewToken();
                userEntity.setToken(token);

                userDao.update(userEntity);

                logger.info("Successful login for user: {}", user.getUsername());
                return token;
            }
        }
        return null;
    }

    private String generateNewToken() {
        SecureRandom secureRandom = new SecureRandom();
        Base64.Encoder base64Encoder = Base64.getUrlEncoder();
        byte[] randomBytes = new byte[24];
        secureRandom.nextBytes(randomBytes);
        return base64Encoder.encodeToString(randomBytes);
    }

    public boolean logOut(String token) {
        UserEntity userEntity = userDao.findByToken(token);
        if (userEntity != null) {
            userEntity.setToken(null);
            userDao.update(userEntity);
            return true;
        }
        return false;
    }

    public UserDto getUserById(Long id) {
        UserEntity userEntity = userDao.findById(id);

        if (userEntity == null) {
            logger.warn("User with id: {} not found during update attempt", id);
            throw new EntityNotFoundException("User with ID " + id + " not found!");
        }

        if (!userEntity.isActive()) {
            logger.warn("Attempted to access inactive user with id: {}", id);
            throw new IllegalStateException("User with ID " + id + " is not active.");
        }
        return toDto(userEntity);
    }

    public Response updateUser(Long id, String token, UserDto userDto) {
        Response authResponse = authenticateAuthorize(id, token, true, true);
        if (authResponse != null) return authResponse;

        UserEntity userEntity = userDao.findById(id);

        if (userEntity == null) {
            logger.warn("User with id {} not found for update.", id);
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("404: User with ID " + id + " not found!")
                    .build();
        }

        if (!userEntity.isActive()) {
            logger.warn("Attempted to update inactive user with id: {}", id);
            return Response.status(Response.Status.FORBIDDEN)
                    .entity("403: User account is inactive.")
                    .build();
        }

        if (userDto.getFirstName() != null) userEntity.setFirstName(userDto.getFirstName());
        if (userDto.getLastName() != null) userEntity.setLastName(userDto.getLastName());
        if (userDto.getEmail() != null) userEntity.setEmail(userDto.getEmail());
        if (userDto.getPhone() != null) userEntity.setPhone(userDto.getPhone());
        if (userDto.getPicture() != null) userEntity.setPicture(userDto.getPicture());

        userEntity = userDao.update(userEntity);

        logger.info("Successful update of user with id: {}", id);
        return Response.ok(toDto(userEntity)).build();
    }

    public Response deleteUser(Long id, String token) {
        Response authResponse = authenticateAuthorize(id, token, true, false);
        if (authResponse != null) return authResponse;

        UserEntity userEntity = userDao.findById(id);

        if (userEntity == null) {
            logger.warn("User with id {} not found for deletion.", id);
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("404: User with ID " + id + " not found!")
                    .build();
        }

        if (!userEntity.isActive()) {
            logger.warn("Attempted to delete inactive user with id: {}", id);
            return Response.status(Response.Status.FORBIDDEN)
                    .entity("403: User account is inactive.")
                    .build();
        }

        boolean success = userDao.delete(id);
        return processActionResult(success, id, "deleted");
    }

    public Response suspendUser(Long id, String token) {
        Response authResponse = authenticateAuthorize(id, token, true, false);
        if (authResponse != null) return authResponse;

        UserEntity userEntity = userDao.findById(id);

        if (userEntity == null) {
            logger.warn("User with id {} not found for suspend.", id);
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("404: User with ID " + id + " not found!")
                    .build();
        }

        if (!userEntity.isActive()) {
            logger.warn("Attempted to suspend inactive user with id: {}", id);
            return Response.status(Response.Status.CONFLICT)
                    .entity("409: User account is already inactive.")
                    .build();
        }

        boolean success = userDao.suspendUser(id);
        return processActionResult(success, id, "suspended");
    }

    public Response activateUser(Long id, String token) {
        Response authResponse = authenticateAuthorize(id, token, true, false);
        if (authResponse != null) return authResponse;

        UserEntity userEntity = userDao.findById(id);

        if (userEntity == null) {
            logger.warn("User with id {} not found for activate.", id);
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("404: User with ID " + id + " not found!")
                    .build();
        }

        if (userEntity.isActive()) {
            logger.warn("Attempted to activate already active user with id: {}", id);
            return Response.status(Response.Status.CONFLICT)
                    .entity("409: User account is already active.")
                    .build();
        }

        boolean success = userDao.activateUser(id);
        return processActionResult(success, id, "activated");
    }

    private Response processActionResult(boolean success, Long id, String action) {
        if (!success) {
            logger.warn("User with id {} not found.", id);
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("404: User with ID " + id + " not found!")
                    .build();
        }

        logger.info("Successful {} of user with id: {}", action, id);
        return Response.ok("200: User " + action + " successfully").build();
    }

    private Response authenticateAuthorize(Long id, String token, boolean requireAdmin, boolean requireSelf) {
        logger.info("Authentication and authorization check started for user with ID: {} and token: {}", id, token);

        if (!isTokenAvailable(token)) {
            logger.warn("Authentication failed: Missing authentication token.");
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("401: Missing authentication token.").build();
        }

        UserEntity authenticatedUser = userDao.findByToken(token);
        if (!isUserAuthenticated(authenticatedUser)) {
            logger.warn("Authentication failed: Invalid authentication token for user with ID: {}", id);
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("401: Invalid authentication token.").build();
        }

        if (requireAdmin || requireSelf) {
            boolean isAuthorized = false;

            if (isUserAdmin(authenticatedUser)) {
                isAuthorized = true;
                logger.info("User with ID: {} is authorized as admin.", id);
            }

            if (isUserSelf(authenticatedUser, id)) {
                isAuthorized = true;
                logger.info("User with ID: {} is authorized as self.", id);
            }

            if (!isAuthorized) {
                logger.warn("User with ID: {} is not authorized to perform this action. Access denied.", id);
                return Response.status(Response.Status.FORBIDDEN)
                        .entity("403: You are not allowed to proceed with this action.").build();
            }
        }

        logger.info("Authentication and authorization check passed for user with ID: {}", id);
        return null;
    }

    private boolean isTokenAvailable(String token) {
        if (token == null || token.isEmpty()) {
            logger.warn("No token provided");
            return false;
        }
        return true;
    }

    private boolean isUserAuthenticated(UserEntity authenticatedUser) {
        if (authenticatedUser == null) {
            logger.warn("Token provided does not match any user.");
            return false;
        }
        return true;
    }

    private boolean isUserAdmin(UserEntity authenticatedUser) {
        if (!authenticatedUser.isAdmin()) {
            logger.warn("User doesn't have admin rights.");
            return false;
        }
        return true;
    }

    private boolean isUserSelf(UserEntity authenticatedUser, Long userId) {
        if (authenticatedUser.getId().equals(userId)) {
            logger.warn("User is not the owner of the account.");
            return true;
        }
        return false;
    }

    public UserDto getUserByUsername(String username) {
        UserEntity userEntity = userDao.findByUsername(username);

        logger.info("Fetching user by username.");
        if (userEntity == null) {
            logger.warn("User with username {} not found.", username);
            throw new EntityNotFoundException("User with username " + username + " not found!");
        }

        if (!userEntity.isActive()) {
            logger.warn("Attempted to access inactive user with username: {}", username);
            throw new IllegalStateException("User with username " + username + " is not active.");
        }

        return toDto(userEntity);
    }

    public List<UserDto> getAllUsers() {
        List<UserEntity> userEntities = userDao.findAll();
        List<UserDto> userDtos = new ArrayList<>();

        logger.info("Fetching all users from the database.");
        for (UserEntity userEntity : userEntities) {
            userDtos.add(toDto(userEntity));
        }

        return userDtos;
    }

    public List<UserDto> getAllActiveUsers() {
        List<UserEntity> userEntities = userDao.findAllActive();
        List<UserDto> userDtos = new ArrayList<>();

        logger.info("Fetching all active users from the database.");
        for (UserEntity userEntity : userEntities) {
            userDtos.add(toDto(userEntity));
        }
        return userDtos;
    }

    public UserEntity toEntity(UserDto userDto) {
        if (userDto == null) {
            return null;
        }

        UserEntity entity = new UserEntity();
        entity.setUsername(userDto.getUsername());
        entity.setPassword(userDto.getPassword());
        entity.setFirstName(userDto.getFirstName());
        entity.setLastName(userDto.getLastName());
        entity.setEmail(userDto.getEmail());
        entity.setPhone(userDto.getPhone());
        entity.setPicture(userDto.getPicture());

        return entity;
    }

    public UserDto toDto(UserEntity userEntity) {
        if (userEntity == null) {
            return null;
        }

        UserDto dto = new UserDto();
        dto.setId(userEntity.getId());
        dto.setUsername(userEntity.getUsername());
        // A password não é devolvida por questões de segurança
        dto.setFirstName(userEntity.getFirstName());
        dto.setLastName(userEntity.getLastName());
        dto.setEmail(userEntity.getEmail());
        dto.setPhone(userEntity.getPhone());
        dto.setPicture(userEntity.getPicture());
        dto.setAdmin(userEntity.isAdmin());
        dto.setActive(userEntity.isActive());
        return dto;
    }
}

