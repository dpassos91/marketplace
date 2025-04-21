package aor.paj.service;

import aor.paj.bean.MessageBean;
import aor.paj.entity.MessageEntity;
import jakarta.ejb.EJB;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/messages")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class MessageService {

    @EJB
    MessageBean messageBean;

    @GET
    @Path("/{otherUser}")
    public Response getConversation(@PathParam("otherUser") String otherUser) {
        // ⚠️ Este valor será substituído futuramente pelo utilizador autenticado
        String currentUser = "ana"; // Exemplo temporário

        List<MessageEntity> conversation = messageBean.getConversation(currentUser, otherUser);

        return Response.ok(conversation).build();
    }
}


