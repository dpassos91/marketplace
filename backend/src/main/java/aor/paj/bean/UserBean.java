package aor.paj.bean;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.Iterator;
import java.util.Map;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;

import aor.paj.dao.UserDao;
import aor.paj.dao.ProductDao;
import aor.paj.dto.LoginRequestDto;
import aor.paj.dto.LoginResponseDto;
import aor.paj.dto.PasswordUpdateDto;
import aor.paj.dto.UserDto;
import aor.paj.dto.UserProfileDto;
import aor.paj.dto.UserRegistrationStatsDto;
import aor.paj.entity.EvaluationEntity;
import aor.paj.entity.ProductEntity;
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

    @Inject
    private ProductDao productDao;

    @Inject
    SettingsBean settingsBean;

    private boolean isValidUsername(String username) {
        return userDao.findByUsername(username) == null;
    }
    
    public UserDto registerUser(UserDto userDto) {
        if (!isValidUsername(userDto.getUsername())) {
            logger.warn("Username already in use: {}", userDto.getUsername());
            throw new IllegalArgumentException("Username already in use");
        }
    
        // Converte o Dto em Entity
        UserEntity userEntity = toEntity(userDto);
        userEntity.setCreatedAt(LocalDate.now());
    
        // Guarda o token original antes de persistir
        String confirmationToken = userEntity.getConfirmationToken();
    
        // Configurações adicionais
        userEntity.setPassword(hashPassword(userDto.getPassword()));
        userEntity.setActive(true);
        userEntity.setAdmin(false);
    
        try {
            userDao.create(userEntity); // sem reassinar
    
            logger.info("User successfully registered: {}", userEntity.getUsername());
    
            // Simula envio de e-mail
            System.out.println("=== TOKEN DE CONFIRMAÇÃO ===");
            System.out.println("Username: " + userEntity.getUsername());
            System.out.println("Token: " + confirmationToken);
            System.out.println("URL: http://localhost:3000/confirmar?token=" + confirmationToken);
            System.out.println("============================");
    
        } catch (Exception exception) {
            logger.error("Error during registration for user: {}", userDto.getUsername(), exception);
            throw exception;
        }
    
        return toDto(userEntity);
    }    

    public String hashPassword(String password) {
        logger.info("Hashing password.");
        return BCrypt.hashpw(password, BCrypt.gensalt());
    }

    public LoginResponseDto logIn(LoginRequestDto user) {
        logger.info("Login attempt for user: {}", user.getUsername());
    
        UserEntity userEntity = userDao.findByUsername(user.getUsername());
    
        if (userEntity != null && userEntity.isActive()) {
    
            // ⚠️ NOVO: bloquear login se conta ainda não estiver confirmada
            if (!userEntity.isConfirmed()) {
                logger.warn("Login denied: User {} has not confirmed their account.", user.getUsername());
    
                // ✅ Verifica se há token — se não, gera e guarda
                String token = userEntity.getConfirmationToken();
                if (token == null || token.isBlank()) {
                    token = UUID.randomUUID().toString();
                    userEntity.setConfirmationToken(token);
                    userDao.update(userEntity); // <- grava o novo token
                    logger.info("Novo token de confirmação gerado e guardado: {}", token);
                }
    
                // 🔁 Reenviar link de confirmação para a consola
                System.out.println("=== TOKEN DE CONFIRMAÇÃO ===");
                System.out.println("Username: " + userEntity.getUsername());
                System.out.println("Token: " + token);
                System.out.println("URL: http://localhost:3000/confirmar?token=" + token);
                System.out.println("=======================================");
    
                throw new SecurityException("Conta ainda não confirmada. Token: " + token);
            }
    
            if (userEntity.checkPassword(user.getPassword())) {
                String sessionToken = generateNewToken();
                userEntity.setToken(sessionToken);
                userEntity.setLastActivityTime(Instant.now());
                userDao.update(userEntity);
    
                logger.info("Successful login for user: {}", user.getUsername());
                return new LoginResponseDto(userEntity.getId(), sessionToken, userEntity.getUsername());
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

    public UserProfileDto getUserProfile(String username) {
    UserEntity user = userDao.findByUsername(username); // ou usa o método interno apropriado
    if (user == null) {
        throw new EntityNotFoundException("Utilizador não encontrado com username: " + username);
    }

    // Buscar produtos vendidos pelo utilizador
    List<ProductEntity> products = productDao.findBySeller(user.getId());

    int totalProducts = products.size();

    // Agrupar por estado textual (ex: "rascunho", "publicado"...)
    Map<String, Long> productsByState = products.stream()
            .collect(Collectors.groupingBy(
                    ProductEntity::getStatus, // usa o método que converte stateId em descrição
                    Collectors.counting()
            ));

    return new UserProfileDto(
            user.getFirstName(),
            user.getLastName(),
            user.getUsername(),
            user.getEmail(),
            user.getPicture(), // ou `getPhotoUrl()` se alterares o nome
            totalProducts,
            productsByState
    );
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

    public Response updatePassword(Long id, String token, PasswordUpdateDto dto) {
    Response auth = authenticateAuthorize(id, token, true, true);
    if (auth != null) return auth;

    UserEntity user = userDao.findById(id);
    if (user == null) {
        logger.warn("User not found for password update.");
        return Response.status(Response.Status.NOT_FOUND).entity("User not found").build();
    }

    if (!user.checkPassword(dto.getCurrentPassword())) {
        logger.warn("Current password incorrect.");
        return Response.status(Response.Status.FORBIDDEN).entity("403: Incorrect current password").build();
    }

    user.setPassword(dto.getNewPassword()); // já faz o hash internamente
    userDao.update(user);
    logger.info("Password updated successfully for user ID: {}", id);
    return Response.ok("200: Password updated successfully").build();
}

public Response deleteUser(Long id, String token) {
    logger.info("Deleting user with id: {} by token: {}", id, token);

    // Autenticação e autorização
    Response authResponse = authenticateAuthorize(id, token, true, false);
    if (authResponse != null) return authResponse;

    UserEntity userEntity = userDao.findByIdWithAssociations(id);
    if (userEntity == null) {
        logger.warn("User with id {} not found for deletion.", id);
        return Response.status(Response.Status.NOT_FOUND)
                .entity("404: User with ID " + id + " not found!")
                .build();
    }

    // ⚠️ Bloquear eliminação de utilizadores administradores
    if (userEntity.isAdmin()) {
        logger.warn("Attempted to delete an admin user with id: {}", id);
        return Response.status(Response.Status.FORBIDDEN)
                .entity("403: Cannot delete an admin user.")
                .build();
    }

    // Inicializar coleções para evitar LazyInitializationException
    userEntity.getSoldProducts().size();
    userEntity.getPurchasedProducts().size();
    userEntity.getGivenEvaluations().size();
    userEntity.getReceivedEvaluations().size();

    // Anonimizar produtos vendidos
    for (Iterator<ProductEntity> iterator = userEntity.getSoldProducts().iterator(); iterator.hasNext();) {
        ProductEntity product = iterator.next();
        product.setSeller(null);
        product.setSellerName("Vendedor excluído");
        userDao.mergeProduct(product);
    }

    // Remover avaliações dadas
    for (Iterator<EvaluationEntity> iterator = userEntity.getGivenEvaluations().iterator(); iterator.hasNext();) {
        EvaluationEntity evaluation = iterator.next();
        evaluation.setEvaluator(null);
        userDao.removeEvaluation(evaluation);
    }

    // Remover avaliações recebidas
    for (Iterator<EvaluationEntity> iterator = userEntity.getReceivedEvaluations().iterator(); iterator.hasNext();) {
        EvaluationEntity evaluation = iterator.next();
        evaluation.setEvaluated(null);
        userDao.removeEvaluation(evaluation);
    }

    // Anular comprador nos produtos comprados (se existirem)
    for (Iterator<ProductEntity> iterator = userEntity.getPurchasedProducts().iterator(); iterator.hasNext();) {
        ProductEntity product = iterator.next();
        product.setBuyer(null);
        userDao.mergeProduct(product);
    }

    // Preparar e eliminar o utilizador
    userEntity.prepareForPermanentDeletion();
    boolean success = userDao.permanentlyDelete(userEntity);
    return processActionResult(success, id, "deleted permanently");
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



public UserEntity getUserByToken(String token) {
    UserEntity user = userDao.findByToken(token);

    if (user == null) return null;

    Instant now = Instant.now();
    Instant lastActivity = user.getLastActivityTime();
    int timeout = settingsBean.getSessionTimeoutMinutes();

    if (lastActivity != null && Duration.between(lastActivity, now).toMinutes() > timeout) {
        logger.info("Sessão expirada para utilizador: {}", user.getUsername());

        // Invalida sessão
        user.setToken(null);
        user.setLastActivityTime(null);
        userDao.update(user);
        return null;
    }

    // Sessão ainda válida → atualiza lastActivity
    user.setLastActivityTime(now);
    userDao.update(user);

    return user;
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

    public List<UserDto> getAllDeletedUsers() {
        logger.info("Fetching all deleted users from the database.");
    
        List<UserEntity> deletedUsers = userDao.findAllDeleted();
        List<UserDto> deletedUserDtos = new ArrayList<>();
    
        for (UserEntity userEntity : deletedUsers) {
            deletedUserDtos.add(toDto(userEntity));
        }
    
        logger.info("All deleted users returned successfully.");
        return deletedUserDtos;
    }

    public UserEntity findByConfirmationToken(String token) {
        return userDao.findByConfirmationToken(token);
    }
    
    public void updateUser(UserEntity user) {
        userDao.update(user);
    }

    public int countTotalUsers() {
        logger.info("Counting total users.");
        return (int) userDao.countAllUsers();
    }

    public int countConfirmedUsers() {
        logger.info("Counting confirmed users.");
        return (int) userDao.countConfirmedUsers();
    }

    public List<UserRegistrationStatsDto> getUsersOverTime() {
    logger.info("Fetching user registrations over time.");

    List<Object[]> results = userDao.countRegistrationsPerDay();
    List<UserRegistrationStatsDto> stats = new ArrayList<>();

    for (Object[] row : results) {
        LocalDate date = (LocalDate) row[0];
        Long registeredUsers = (Long) row[1];

        UserRegistrationStatsDto dto = new UserRegistrationStatsDto();
        dto.setDate(date);
        dto.setRegisteredUsers(registeredUsers.intValue());

        stats.add(dto);
    }

    logger.info("Fetched {} user registration stats.", stats.size());
    return stats;
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
    
        // novo utilizador: gerar token e marcar como não confirmado
        entity.setConfirmed(false);
        entity.setConfirmationToken(UUID.randomUUID().toString());
    
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
        dto.setConfirmed(userEntity.isConfirmed());

        // Apenas para contas ainda não confirmadas: incluir o token no DTO
        if (!userEntity.isConfirmed()) {
            dto.setConfirmationToken(userEntity.getConfirmationToken());
        }
        return dto;
    }
}

