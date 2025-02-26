package aor.paj.resource;

import java.net.URI;
import java.util.List;

import aor.paj.dto.ProductDto;
import aor.paj.service.ProductService;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/products")
public class ProductResource {

    @Inject
    ProductService productService;

    @GET
    @Path("/all")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllProducts() {
        List<ProductDto> products = productService.getAllProducts();
        return Response.ok(products).build();
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProductById(@PathParam("id") String id) {
        ProductDto productDto = productService.getProductById(id);
        return productDto == null ? Response.status(200).entity("Produto não encontrado!").build()
                : Response.ok(productDto).build();
    }

    @GET
    @Path("/details")
    public Response getProductDetails(@QueryParam("id") String productId) {
        return Response.seeOther(URI.create("/detalhes-produto.html?id=" + productId)).build();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response addProduct(ProductDto productDto) {
        productService.addProduct(productDto);
        return Response.status(Response.Status.CREATED).entity(productDto).build();
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateProduct(@PathParam("id") String id, ProductDto productDto) {
        ProductDto existingProduct = productService.getProductById(id);
        if (existingProduct == null) {
            return Response.status(404).entity("Product not found!").build();
        }
        productDto.setId(id);
        productService.updateProduct(productDto);
        return Response.ok(productDto).build();
    }

    @DELETE
    @Path("/{id}")
    @Produces(MediaType.TEXT_PLAIN)
    public Response deleteProduct(@PathParam("id") String id) {
        ProductDto existingProduct = productService.getProductById(id);
        if (existingProduct == null) {
            return Response.status(404).entity("Product not found!").build();
        }
        productService.deleteProduct(id);
        return Response.noContent().build();
    }
}
