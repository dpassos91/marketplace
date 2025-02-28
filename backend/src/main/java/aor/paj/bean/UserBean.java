package aor.paj.bean;

import java.util.HashMap;
import java.util.Map;

import aor.paj.dao.UserDao;
import aor.paj.dto.UserDto;
import aor.paj.entity.UserEntity;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

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

    // TODO: leitura e escrita em ficheiro
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
    }*/

    public UserDto registerUser(UserDto userDto) {
        UserEntity userEntity = toEntity(userDto);
        // TODO: verificar se o user já existe e fazer a encriptação da password
        userEntity.setActive(true);
        userEntity.setAdmin(false);
        userEntity = userDao.create(userEntity);
        return toDto(userEntity);
    }

    public UserDto getUserById(Long id) {
        UserEntity userEntity = userDao.findById(id);
        if (userEntity == null) {
            // TODO: como tratar?
        }
        return toDto(userEntity);
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
        entity.setPhone(userDto.getTelefone());

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
        dto.setTelefone(userEntity.getPhone());

        return dto;
    }
}
