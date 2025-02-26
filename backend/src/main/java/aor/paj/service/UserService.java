package aor.paj.service;

import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import aor.paj.dto.UserDto;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;

@ApplicationScoped
public class UserService {

    private Map<String, UserDto> users = new HashMap<>();
    private static final String USERS_FILE = "../database/users.json";

    @PostConstruct
    public void init() {
        loadUsersFromFile();
    }

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
    }

    public UserDto registerUser(UserDto userDto) {
        if (users.containsKey(userDto.getUsername())) {
            throw new RuntimeException("Username já existente!");
        }
        users.put(userDto.getUsername(), userDto);
        saveUsersToFile();
        return userDto;
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
        saveUsersToFile();
    }

    public boolean checkUsernameExists(String username) {
        return users.containsKey(username);
    }

    public UserDto updateUser(String username, UserDto updatedUser) {
        UserDto existingUser = users.get(username);
        if (existingUser == null) {
            throw new RuntimeException("Utilizador não encontrado.");
        }
        existingUser.setNome(updatedUser.getNome());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setTelefone(updatedUser.getTelefone());
        existingUser.setImagem(updatedUser.getImagem());
        if (updatedUser.getPassword() != null) {
            existingUser.setPassword(updatedUser.getPassword());
        }
        users.put(username, existingUser);
        saveUsersToFile();
        return existingUser;
    }
}
