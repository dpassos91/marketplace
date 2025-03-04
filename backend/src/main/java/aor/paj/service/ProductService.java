package aor.paj.service;

import java.util.List;

import aor.paj.bean.ProductBean;
import aor.paj.dto.ProductDto;
import aor.paj.exception.BadRequestException;
import aor.paj.exception.ResourceNotFoundException;
import aor.paj.util.ProductStateId;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.DefaultValue;
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
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductService {

    @Inject
    private ProductBean productBean;

    /**
     * Get all products
     * 
     * @return Response containing a list of all products
     */
    @GET
    public Response getAllProducts() {
        List<ProductDto> products = productBean.getAllProducts();
        return Response.ok(products).build();
    }

    /**
     * Get all active products
     * 
     * @return Response containing a list of active products
     */
    @GET
    @Path("/active")
    public Response getAllActiveProducts() {
        List<ProductDto> products = productBean.getAllActiveProducts();
        return Response.ok(products).build();
    }

    /**
     * Get products with pagination
     * 
     * @param page The page number (0-based)
     * @param size The number of items per page
     * @return Response containing a list of products for the specified page
     */
    @GET
    @Path("/paginated")
    public Response getProductsPaginated(
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("10") int size) {
        List<ProductDto> products = productBean.getProductsPaginated(page, size);
        return Response.ok(products).build();
    }

    /**
     * Get the total number of products
     * 
     * @return Response containing the total count
     */
    @GET
    @Path("/count")
    public Response getProductCount() {
        Long count = productBean.getProductCount();
        return Response.ok(count).build();
    }

    /**
     * Get the total number of active products
     * 
     * @return Response containing the active product count
     */
    @GET
    @Path("/active/count")
    public Response getActiveProductCount() {
        Long count = productBean.getActiveProductCount();
        return Response.ok(count).build();
    }

    /**
     * Get a product by its ID
     * 
     * @param id The ID of the product
     * @return Response containing the product or 404 if not found
     */
    @GET
    @Path("/{id}")
    public Response getProductById(@PathParam("id") Long id) {
        ProductDto product = productBean.getProductById(id);
        if (product == null) {
            throw new ResourceNotFoundException("Product with id " + id + " not found");
        }
        return Response.ok(product).build();
    }

    /**
     * Get products by category
     * 
     * @param categoryId The ID of the category
     * @return Response containing a list of products in the category
     */
    @GET
    @Path("/category/{categoryId}")
    public Response getProductsByCategory(@PathParam("categoryId") Long categoryId) {
        List<ProductDto> products = productBean.getProductsByCategory(categoryId);
        return Response.ok(products).build();
    }

    /**
     * Get products by seller
     * 
     * @param sellerId The ID of the seller
     * @return Response containing a list of products by the seller
     */
    @GET
    @Path("/seller/{sellerId}")
    public Response getProductsBySeller(@PathParam("sellerId") Long sellerId) {
        List<ProductDto> products = productBean.getProductsBySeller(sellerId);
        return Response.ok(products).build();
    }

    /**
     * Get products by title (partial match)
     * 
     * @param title The title to search for
     * @return Response containing a list of products matching the title
     */
    @GET
    @Path("/search")
    public Response getProductsByTitle(@QueryParam("title") String title) {
        if (title == null || title.trim().isEmpty()) {
            throw new BadRequestException("Title parameter is required");
        }

        List<ProductDto> products = productBean.getProductsByTitle(title);
        return Response.ok(products).build();
    }

    /**
     * Get products by location
     * 
     * @param location The location to search for
     * @return Response containing a list of products in the location
     */
    @GET
    @Path("/location/{location}")
    public Response getProductsByLocation(@PathParam("location") String location) {
        List<ProductDto> products = productBean.getProductsByLocation(location);
        return Response.ok(products).build();
    }

    /**
     * Get products by status
     * 
     * @param status The status to search for
     * @return Response containing a list of products with the status
     */
    @GET
    @Path("/status/{status}")
    public Response getProductsByStatus(@PathParam("status") String status) {
        List<ProductDto> products = productBean.getProductsByStatus(status);
        return Response.ok(products).build();
    }

    /**
     * Create a new product
     * 
     * @param productDto The product to create
     * @return Response containing the created product or 400 if invalid
     */
    @POST
    public Response createProduct(ProductDto productDto) {
        if (productDto == null) {
            throw new BadRequestException("Product data is required");
        }

        // Validate required fields
        if (productDto.getTitle() == null || productDto.getTitle().trim().isEmpty() ||
                productDto.getDescription() == null || productDto.getDescription().trim().isEmpty() ||
                productDto.getPrice() == null || productDto.getPrice() <= 0 ||
                productDto.getLocation() == null || productDto.getLocation().trim().isEmpty() ||
                productDto.getCategoryId() == null || productDto.getSellerId() == null) {
            throw new BadRequestException(
                    "Missing required fields: title, description, price, location, category and seller");
        }

        ProductDto createdProduct = productBean.addProduct(productDto);
        if (createdProduct == null) {
            throw new BadRequestException("Could not create product. Verify that the seller and category exist.");
        }

        return Response.status(Response.Status.CREATED).entity(createdProduct).build();
    }

    /**
     * Update an existing product
     * 
     * @param id         The ID of the product to update
     * @param productDto The updated product data
     * @return Response containing the updated product or appropriate error status
     */
    @PUT
    @Path("/{id}")
    public Response updateProduct(@PathParam("id") Long id, ProductDto productDto) {
        if (productDto == null) {
            throw new BadRequestException("Product data is required");
        }

        // Ensure ID in path matches the one in DTO
        if (productDto.getId() == null) {
            productDto.setId(id);
        } else if (!productDto.getId().equals(id)) {
            throw new BadRequestException("ID in path doesn't match ID in product");
        }

        ProductDto updatedProduct = productBean.updateProduct(productDto);
        if (updatedProduct == null) {
            throw new ResourceNotFoundException("Product with id " + id + " not found");
        }

        return Response.ok(updatedProduct).build();
    }

    /**
     * Update a product's status
     * 
     * @param id      The ID of the product
     * @param stateId The new state ID
     * @return Response containing the updated product or appropriate error status
     */
    @PUT
    @Path("/{id}/status/{stateId}")
    public Response updateProductStatus(
            @PathParam("id") Long id,
            @PathParam("stateId") int stateId) {
        ProductDto updatedProduct = productBean.updateProductStatus(id, stateId);
        if (updatedProduct == null) {
            throw new ResourceNotFoundException("Product with id " + id + " not found");
        }

        return Response.ok(updatedProduct).build();
    }

    /**
     * Mark a product as purchased by a specific buyer
     * 
     * @param id      The ID of the product
     * @param buyerId The ID of the buyer
     * @return Response containing the updated product or appropriate error status
     */
    @PUT
    @Path("/{id}/purchase/{buyerId}")
    public Response purchaseProduct(
            @PathParam("id") Long id,
            @PathParam("buyerId") Long buyerId) {
        ProductDto updatedProduct = productBean.markProductAsPurchased(id, buyerId);
        if (updatedProduct == null) {
            throw new BadRequestException(
                    "Cannot complete purchase. Verify that the product is available and the buyer is not the seller.");
        }

        return Response.ok(updatedProduct).build();
    }

    /**
     * Get all inactive (soft-deleted) products
     * 
     * @return Response containing a list of inactive products
     */
    @GET
    @Path("/inactive")
    public Response getAllInactiveProducts() {
        List<ProductDto> products = productBean.getAllInactiveProducts();
        return Response.ok(products).build();
    }

    /**
     * Soft delete a product by setting its state to INATIVO
     * This is the standard method for "deleting" products and should be used
     * instead of permanent deletion
     * 
     * @param id The ID of the product to deactivate
     * @return Response containing the updated product or 404 if not found
     */
    @PUT
    @Path("/{id}/deactivate")
    public Response deactivateProduct(@PathParam("id") Long id) {
        ProductDto updatedProduct = productBean.deactivateProduct(id);
        if (updatedProduct == null) {
            throw new ResourceNotFoundException("Product with id " + id + " not found");
        }

        return Response.ok(updatedProduct).build();
    }

    /**
     * Reactivate an inactive product
     * 
     * @param id      The ID of the product to reactivate
     * @param stateId The new state ID to set
     * @return Response containing the updated product or 404 if not found
     */
    @PUT
    @Path("/{id}/reactivate/{stateId}")
    public Response reactivateProduct(
            @PathParam("id") Long id,
            @PathParam("stateId") int stateId) {
        // Validate that the stateId is not INATIVO
        if (stateId == ProductStateId.INATIVO.getStateId()) {
            throw new BadRequestException("Cannot reactivate to INATIVO state");
        }

        ProductDto updatedProduct = productBean.reactivateProduct(id, stateId);
        if (updatedProduct == null) {
            throw new ResourceNotFoundException("Product with id " + id + " not found");
        }

        return Response.ok(updatedProduct).build();
    }

    /**
     * Permanently delete an inactive product
     * 
     * @param id The ID of the product to permanently delete
     * @return Response with 204 No Content if successful
     */
    @DELETE
    @Path("/{id}/permanent")
    public Response permanentlyDeleteProduct(@PathParam("id") Long id) {
        boolean deleted = productBean.permanentlyDeleteProduct(id);
        if (!deleted) {
            throw new BadRequestException("Product with id " + id + " not found or not in inactive state");
        }
        return Response.noContent().build();
    }
}
