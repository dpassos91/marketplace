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
        SecureRandom secureRandom = new SecureRandom(); //threadsafe
        Base64.Encoder base64Encoder = Base64.getUrlEncoder(); //threadsafe
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
        return toDto(userEntity);
    }

    public Response updateUser(Long id, String token, UserDto userDto) {
        Response authResponse = authenticateAuthorize(id, token, true, true);
        if (authResponse != null) return authResponse;

        UserEntity userEntity = userDao.findById(id);

        if (userEntity == null) {
            logger.warn("User with id {} not found.", id);
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("User with ID " + id + " not found!")
                    .build();
        }

        if (userDto.getFirstName() != null) userEntity.setFirstName(userDto.getFirstName());
        if (userDto.getLastName() != null) userEntity.setLastName(userDto.getLastName());
        if (userDto.getEmail() != null) userEntity.setEmail(userDto.getEmail());
        if (userDto.getPhone() != null) userEntity.setPhone(userDto.getPhone());
        // TODO: falta permitir a atualização da foto

        userEntity = userDao.update(userEntity);

        logger.info("Successful update of user with id: {}", id);
        return Response.ok(toDto(userEntity)).build();
    }

    public Response deleteUser(Long id, String token) {
        Response authResponse = authenticateAuthorize(id, token, true, false);
        if (authResponse != null) return authResponse;

        boolean success = userDao.delete(id);
        if (!success) {
            logger.warn("User with id {} not found.", id);
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("User with ID " + id + " not found!")
                    .build();
        }

        logger.info("Successful deletion of user with id: {}", id);
        return Response.ok("User deleted successfully").build();
    }

    public Response suspendUser(Long id, String token) {
        Response authResponse = authenticateAuthorize(id, token, true, false);
        if (authResponse != null) return authResponse;

        boolean success = userDao.suspendUser(id);
        if (!success) {
            logger.warn("User with id {} not found.", id);
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("User with ID " + id + " not found!")
                    .build();
        }

        logger.info("Successful suspension of user with id: {}", id);
        return Response.ok("User suspended successfully").build();
    }

    private Response authenticateAuthorize(Long id, String token, boolean requireAdmin, boolean requireSelf){
        if (!isTokenAvailable(token)) return Response.status(Response.Status.UNAUTHORIZED)
                .entity("Missing authentication token.").build();

        UserEntity authenticatedUser = userDao.findByToken(token);
        if (!isUserAuthenticated(authenticatedUser)) return Response.status(Response.Status.UNAUTHORIZED)
                .entity("Invalid authentication token.").build();

        if (requireAdmin || requireSelf) {
            boolean isAuthorized = false;

            if (isUserAdmin(authenticatedUser)) isAuthorized = true;

            if (isUserSelf(authenticatedUser, id)) isAuthorized = true;

            if (!isAuthorized) return Response.status(Response.Status.FORBIDDEN)
                    .entity("You are not authorized to proceed with this action.").build();
        }

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
            logger.warn("User without admin rights attempted to suspend another user.");
            return false;
        }
        return true;
    }

    private boolean isUserSelf(UserEntity authenticatedUser, Long userId) {
        if (authenticatedUser.getId().equals(userId)) {
            return true;
        }
        return false;
    }

    // TODO: método isSuccessful

    private boolean isUserSuspended() {
        return false;
    }

    public UserDto getUserByUsername(String username) {
        UserEntity userEntity = userDao.findByUsername(username);

        // TODO: faltam os logs
        if (userEntity == null) {
            throw new EntityNotFoundException("User with username " + username + " not found!");
        }
        return toDto(userEntity);
    }

    public List<UserDto> getAllUsers() {
        List<UserEntity> userEntities = userDao.findAll();
        List<UserDto> userDtos = new ArrayList<>();

        for (UserEntity userEntity : userEntities) {
            userDtos.add(toDto(userEntity));
        }

        return userDtos;
    }

    public List<UserDto> getAllActiveUsers() {
        List<UserEntity> userEntities = userDao.findAllActive();
        List<UserDto> userDtos = new ArrayList<>();

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
        entity.SetPicture(userDto.getPicture());

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

        return dto;
    }
}
