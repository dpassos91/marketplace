package aor.paj.util;

import aor.paj.dto.ProductDto;
import aor.paj.dto.UserDto;
import jakarta.json.Json;
import jakarta.json.JsonObject;

public class WebSocketUtils {

    public static String createProductUpdatedMessage(ProductDto product) {
        JsonObject message = Json.createObjectBuilder()
            .add("type", "productUpdated")
            .add("data", Json.createObjectBuilder()
                .add("id", product.getId())
                .add("title", product.getTitle())
                .add("description", product.getDescription())
                .add("price", product.getPrice())
                .add("location", product.getLocation())
                .add("categoryId", product.getCategoryId())
                .add("sellerId", product.getSellerId())
                .add("active", product.isActive())
                .add("imageUrl", (product.getImageUrl() != null && !product.getImageUrl().isBlank()) ? product.getImageUrl() : "")
            )
            .build();
        return message.toString();
    }

    public static String createProductCreatedMessage(ProductDto product) {
        JsonObject message = Json.createObjectBuilder()
            .add("type", "productCreated")
            .add("data", Json.createObjectBuilder()
                .add("id", product.getId())
                .add("title", product.getTitle())
                .add("description", product.getDescription())
                .add("price", product.getPrice())
                .add("location", product.getLocation())
                .add("categoryId", product.getCategoryId())
                .add("sellerId", product.getSellerId())
                .add("active", product.isActive())
                .add("imageUrl", (product.getImageUrl() != null && !product.getImageUrl().isBlank()) ? product.getImageUrl() : "")
            )
            .build();
        return message.toString();
    }
    
    public static String createUserCreatedMessage(UserDto user) {
        JsonObject message = Json.createObjectBuilder()
            .add("type", "userCreated")
            .add("data", Json.createObjectBuilder()
                .add("id", user.getId())
                .add("username", user.getUsername())
                .add("firstName", user.getFirstName())
                .add("lastName", user.getLastName())
                .add("email", user.getEmail())
                .add("phone", user.getPhone())
                .add("picture", user.getPicture())
                .add("active", user.getActive())
                .add("admin", user.getAdmin())
            )
            .build();
        return message.toString();
    }
}

