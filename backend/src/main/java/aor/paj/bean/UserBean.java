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
        // verifica se o username já existe na base de dados
        if (!isValidUsername(userDto.getUsername())) {
            logger.warn("Username already in use: {}", userDto.getUsername());
            // caso exista interrompe o fluxo
            throw new IllegalArgumentException("Username already in use");
        }
        // converte o Dto em Entity
        UserEntity userEntity = toEntity(userDto);
        // faz 'set' da password em Hash, do estado e da condição de Admin
        userEntity.setPassword(hashPassword(userDto.getPassword()));
        userEntity.setActive(true);
        userEntity.setAdmin(false);
        // tenta registar o novo utilizador
        try {
            userEntity = userDao.create(userEntity);
            logger.info("User successfully registered: {}", userDto.getUsername());
        } catch (Exception exception) {
            logger.error("Error during registration for user: {}", userDto.getUsername(), exception);
            throw exception;
        }
        // retorna os dados para depuração
        return toDto(userEntity);
    }

    private boolean isValidUsername(String username) {
        logger.info("Checking if username {} is valid.", username);
        // vai buscar a lista de usernames à base de dados
        List<String> allUsername = userDao.findAllUsername();
        // compara os usernames da lista com o novo
        for (String existingUsername : allUsername) {
            if (existingUsername.equals(username)) {
                logger.warn("Username {} is already in use.", username);
                return false;
            }
        }
        logger.info("Username {} is valid.", username);
        return true;
    }

    public String hashPassword(String password) {
        logger.info("Hashing password.");
        return BCrypt.hashpw(password, BCrypt.gensalt());
    }

    public String logIn(LoginRequestDto user) {
        logger.info("Login attempt for user: {}", user.getUsername());
        // procura a Entity através do username providenciado
        UserEntity userEntity = userDao.findByUsername(user.getUsername());
        // se encontrar verifica se é um user ativo
        if (userEntity != null && userEntity.isActive()) {
            // se estiver ativo compara a password providenciada
            if (userEntity.checkPassword(user.getPassword())) {
                // se as credênciais forem válidas gera a token e insere-a na base de dados
                String token = generateNewToken();
                userEntity.setToken(token);

                userDao.update(userEntity);

                logger.info("Successful login for user: {}", user.getUsername());
                // devolve a token
                return token;
            }
        }
        logger.warn("Login failed for user: {}", user.getUsername());
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
        logger.info("Logging out user with token: {}", token);
        // encontra a Entity através da token
        UserEntity userEntity = userDao.findByToken(token);
        if (userEntity != null) {
            // coloca o atributo token como null na base de dados
            userEntity.setToken(null);
            userDao.update(userEntity);
            logger.info("User with token {} logged out successfully.", token);
            return true;
        }
        logger.warn("Logout failed for token: {}", token);
        return false;
    }

    public UserDto getUserById(Long id) {
        // vai procurar o user através do ID à base de dados
        UserEntity userEntity = userDao.findById(id);

        if (userEntity == null) {
            logger.warn("User with id: {} not found.", id);
            throw new EntityNotFoundException("User with ID " + id + " not found!");
        }

        if (!userEntity.isActive()) {
            logger.warn("Attempted to access inactive user with id: {}", id);
            throw new IllegalStateException("User with ID " + id + " is not active.");
        }
        logger.info("User with id: {} found.", id);
        return toDto(userEntity);
    }

    public Response updateUser(Long id, String token, UserDto userDto) {
        // verifica se o user está autenticado e autorizado a proceder com esta funcionalidade
        Response authResponse = authenticateAuthorize(id, token, true, true);
        if (authResponse != null) return authResponse;
        // vai buscar a Entity à base de dados para fazer o update
        UserEntity userEntity = userDao.findById(id);
        // se não for encontrada retorna
        if (userEntity == null) {
            logger.warn("User with id {} not found for update.", id);
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("404: User with ID " + id + " not found!")
                    .build();
        }
        // verifica se está ativo
        if (!userEntity.isActive()) {
            logger.warn("Attempted to update inactive user with id: {}", id);
            return Response.status(Response.Status.FORBIDDEN)
                    .entity("403: User account is inactive.")
                    .build();
        }
        // procede às alterações nos campos que têm alterações a aplicar
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
        logger.info("Deleting user with id: {} by token: {}", id, token);
        // verifica se o user está autenticado e autorizado a proceder com esta funcionalidade
        Response authResponse = authenticateAuthorize(id, token, true, false);
        if (authResponse != null) return authResponse;
        // vai buscar a Entity à base de dados para fazer o update
        UserEntity userEntity = userDao.findById(id);
        // se não for encontrada retorna
        if (userEntity == null) {
            logger.warn("User with id {} not found for deletion.", id);
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("404: User with ID " + id + " not found!")
                    .build();
        }
        // verifica se está ativo
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
        logger.info("Suspending user with id: {} by token: {}", id, token);
        // verifica se o user está autenticado e autorizado a proceder com esta funcionalidade
        Response authResponse = authenticateAuthorize(id, token, true, false);
        if (authResponse != null) return authResponse;
        // vai buscar a Entity à base de dados para fazer o update
        UserEntity userEntity = userDao.findById(id);
        // se não for encontrada retorna
        if (userEntity == null) {
            logger.warn("User with id {} not found for suspend.", id);
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("404: User with ID " + id + " not found!")
                    .build();
        }
        // verifica se está ativo
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
        logger.info("Activating user with id: {} by token: {}", id, token);
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
        // verifica se determinada ação foi realizada com sucesso
        if (!success) {
            logger.warn("User with id {} not found.", id);
            // se não foi devolve resposta adequada
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("404: User with ID " + id + " not found!")
                    .build();
        }

        logger.info("Successful {} of user with id: {}", action, id);
        // se foi devolve mensagem de sucesso
        return Response.ok("200: User " + action + " successfully").build();
    }

    private Response authenticateAuthorize(Long id, String token, boolean requireAdmin, boolean requireSelf) {
        logger.info("Authentication and authorization check started for user with ID: {} and token: {}", id, token);
        // verifica que existe token
        if (!isTokenAvailable(token)) {
            logger.warn("Authentication failed: Missing authentication token.");
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("401: Missing authentication token.").build();
        }
        // verifica se a token é válida (se existe na base de dados)
        UserEntity authenticatedUser = userDao.findByToken(token);
        if (!isUserAuthenticated(authenticatedUser)) {
            logger.warn("Authentication failed: Invalid authentication token for user with ID: {}", id);
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("401: Invalid authentication token.").build();
        }
        // verifica se o user tem permissão para executar a ação pretendida
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
        // caso passe todas as validações retorna null
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
        logger.info("Fetching user by username.");
        // procura o user através do username indicado
        UserEntity userEntity = userDao.findByUsername(username);

        if (userEntity == null) {
            logger.warn("User with username {} not found.", username);
            throw new EntityNotFoundException("User with username " + username + " not found!");
        }

        if (!userEntity.isActive()) {
            logger.warn("Attempted to access inactive user with username: {}", username);
            throw new IllegalStateException("User with username " + username + " is not active.");
        }
        logger.info("User with username {} found.", username);
        return toDto(userEntity);
    }

    public List<UserDto> getAllUsers() {
        logger.info("Fetching all users from the database.");

        List<UserEntity> userEntities = userDao.findAll();
        List<UserDto> userDtos = new ArrayList<>();

        for (UserEntity userEntity : userEntities) {
            userDtos.add(toDto(userEntity));
        }
        logger.info("All users returned successfully.");
        return userDtos;
    }

    public List<UserDto> getAllActiveUsers() {
        logger.info("Fetching all active users from the database.");

        List<UserEntity> userEntities = userDao.findAllActive();
        List<UserDto> userDtos = new ArrayList<>();

        for (UserEntity userEntity : userEntities) {
            userDtos.add(toDto(userEntity));
        }
        logger.info("All active users returned successfully.");
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

