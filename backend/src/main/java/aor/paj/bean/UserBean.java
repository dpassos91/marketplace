package aor.paj.bean;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import aor.paj.dao.UserDao;
import aor.paj.dto.LoginRequestDto;
import aor.paj.dto.UserDto;
import aor.paj.entity.UserEntity;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityNotFoundException;
import org.mindrot.jbcrypt.BCrypt;

@ApplicationScoped
public class UserBean {

    @Inject
    private UserDao userDao;

    private Map<String, UserDto> users = new HashMap<>();
    // private static final String USERS_FILE = "../database/users.json";

    @PostConstruct
    public void init() {
        // loadUsersFromFile();
    }

    // TODO: métodos do projeto anterior incluíndo leitura e escrita em ficheiro
    /*
    private void loadUsersFromFile() {
        File file = new File(USERS_FILE);
        if (file.exists()) {
            try (FileReader fileReader = new FileReader(file)) {
                Jsonb jsonb = JsonbBuilder.create();
                Type userListType = new ArrayList<UserDto>() {
                }.getClass().getGenericSuperclass();
                List<UserDto> userList = jsonb.fromJson(fileReader, userListType);
                users = new HashMap<>();
                for (UserDto user : userList) {
                    users.put(user.getUsername(), user);
                }
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        } else {
            users = new HashMap<>();
        }
    }

    private void saveUsersToFile() {
        try (FileWriter fileWriter = new FileWriter(USERS_FILE)) {
            Jsonb jsonb = JsonbBuilder.create();
            List<UserDto> userList = new ArrayList<>(users.values());
            jsonb.toJson(userList, fileWriter);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

            public UserDto loginUser(String username, String password) {
        UserDto existingUser = users.get(username);
        if (existingUser == null || !existingUser.getPassword().equals(password)) {
            throw new RuntimeException("Credenciais inválidas!");
        }
        return existingUser;
    }

            public UserDto getUserByUsername(String username) {
        UserDto userDto = users.get(username);
        if (userDto == null) {
            throw new RuntimeException("Utilizador não encontrado!");
        }
        return userDto;
    }

    public void deleteUserByUsername(String username) {
        if (!users.containsKey(username)) {
            throw new RuntimeException("User not found");
        }
        users.remove(username);
        // saveUsersToFile();
    }

    public boolean checkUsernameExists(String username) {
        return users.containsKey(username);
    }

    public UserDto updateUser(String username, UserDto updatedUser) {
        UserDto existingUser = users.get(username);
        if (existingUser == null) {
            throw new RuntimeException("Utilizador não encontrado.");
        }
        // existingUser.setNome(updatedUser.getNome());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setTelefone(updatedUser.getTelefone());
        existingUser.setImagem(updatedUser.getImagem());
        if (updatedUser.getPassword() != null) {
            existingUser.setPassword(updatedUser.getPassword());
        }
        users.put(username, existingUser);
        // saveUsersToFile();
        return existingUser;
    }
    }*/

    public UserDto registerUser(UserDto userDto) {
        if (!isValidUsername(userDto.getUsername())) {
            throw new IllegalArgumentException("Username already in use");
        }

        UserEntity userEntity = toEntity(userDto);

        userEntity.setPassword(hashPassword(userDto.getPassword()));
        userEntity.setActive(true);
        userEntity.setAdmin(false);

        userEntity = userDao.create(userEntity);
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
        if (userEntity != null) {
            if (userEntity.checkPassword(user.getPassword())) {
                String token = generateNewToken();
                userEntity.setToken(token);

                userDao.update(userEntity);

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
            throw new EntityNotFoundException("User with ID " + id + " not found!");
        }
        return toDto(userEntity);
    }

    public UserDto updateUser(Long id, UserDto userDto) {
        UserEntity userEntity = userDao.findById(id);

        if (userEntity == null) {
            throw new EntityNotFoundException("User with ID " + id + " not found!");
        }

        if (userDto.getFirstName() != null) userEntity.setFirstName(userDto.getFirstName());
        if (userDto.getLastName() != null) userEntity.setLastName(userDto.getLastName());
        if (userDto.getEmail() != null) userEntity.setEmail(userDto.getEmail());
        if (userDto.getPhone() != null) userEntity.setPhone(userDto.getPhone());

        userEntity = userDao.update(userEntity);

        return toDto(userEntity);
    }

    public boolean deleteUser(Long id) {
        return userDao.delete(id);
    }

    public void suspendUser(Long id) {

    }

    public boolean isAuthorized(Long userId, String token) {
        if (token == null || token.isEmpty()) {
            return false;
        }

        UserEntity authenticatedUser = userDao.findById(userId);
        if (authenticatedUser == null) {
            return false;
        }

        return authenticatedUser.getId().equals(userId) || authenticatedUser.isAdmin();
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

        return entity;
    }

    public UserDto toDto(UserEntity userEntity) {
        if (userEntity == null) {
            return null;
        }

        UserDto dto = new UserDto();
        dto.setUsername(userEntity.getUsername());
        // A password não é devolvida por questões de segurança
        dto.setFirstName(userEntity.getFirstName());
        dto.setLastName(userEntity.getLastName());
        dto.setEmail(userEntity.getEmail());
        dto.setPhone(userEntity.getPhone());

        return dto;
    }
}
