package aor.paj.service;

import aor.paj.bean.MessageBean;
import aor.paj.bean.UserBean;
import aor.paj.dto.MessageDto;
import aor.paj.entity.MessageEntity;
import aor.paj.entity.UserEntity;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.stream.Collectors;

@Path("/messages")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class MessageService {

    @Inject
    MessageBean messageBean;

    @Inject
    UserBean userBean;

    @GET
    @Path("/{otherUser}")
    public Response getConversation(@PathParam("otherUser") String otherUser, @HeaderParam("token") String token) {
        System.out.println("🔐 Token recebido no header: " + token);
        UserEntity currentUser = userBean.getUserByToken(token);
        System.out.println("👤 Utilizador autenticado: " + (currentUser != null ? currentUser.getUsername() : "null"));


        if (currentUser == null) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("Token inválido ou sessão expirada.").build();
        }

        List<MessageEntity> conversation = messageBean.getConversation(currentUser.getUsername(), otherUser);
        List<MessageDto> dtoList = conversation.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());

        return Response.ok(dtoList).build();
    }

    @POST
    public Response sendMessage(MessageDto messageDto) {
        messageBean.saveMessage(
                messageDto.getSender(),
                messageDto.getReceiver(),
                messageDto.getContent()
        );
        return Response.status(Response.Status.CREATED).build();
    }

    private MessageDto toDTO(MessageEntity entity) {
        MessageDto dto = new MessageDto();
        dto.setSender(entity.getSender().getUsername());
        dto.setReceiver(entity.getReceiver().getUsername());
        dto.setContent(entity.getContent());
        return dto;
    }
}




