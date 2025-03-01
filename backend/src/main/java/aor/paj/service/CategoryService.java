package aor.paj.service;

import java.util.List;

import aor.paj.bean.CategoryBean;
import aor.paj.dto.CategoryDto;
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

@Path("/categories")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CategoryService {

    @Inject
    private CategoryBean categoryBean;

    /**
     * Get all categories
     * 
     * @return Response containing a list of all categories
     */
    @GET
    public Response getAllCategories() {
        List<CategoryDto> categories = categoryBean.getAllCategories();
        return Response.ok(categories).build();
    }

    /**
     * Get categories with pagination
     * 
     * @param page The page number (0-based)
     * @param size The number of items per page
     * @return Response containing a list of categories for the specified page
     */
    @GET
    @Path("/paginated")
    public Response getCategoriesPaginated(
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("10") int size) {
        List<CategoryDto> categories = categoryBean.getCategoriesPaginated(page, size);
        return Response.ok(categories).build();
    }

    /**
     * Get the total number of categories
     * 
     * @return Response containing the total count
     */
    @GET
    @Path("/count")
    public Response getCategoryCount() {
        Long count = categoryBean.getCategoryCount();
        return Response.ok(count).build();
    }

    /**
     * Get a category by its ID
     * 
     * @param id The ID of the category
     * @return Response containing the category or 404 if not found
     */
    @GET
    @Path("/{id}")
    public Response getCategoryById(@PathParam("id") Long id) {
        CategoryDto category = categoryBean.getCategoryById(id);
        if (category == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(category).build();
    }

    /**
     * Get a category by its name
     * 
     * @param name The name of the category
     * @return Response containing the category or 404 if not found
     */
    @GET
    @Path("/name/{name}")
    public Response getCategoryByName(@PathParam("name") String name) {
        CategoryDto category = categoryBean.getCategoryByName(name);
        if (category == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(category).build();
    }

    /**
     * Check if a category with the given name exists
     * 
     * @param name The name to check
     * @return Response containing a boolean indicating if the category exists
     */
    @GET
    @Path("/exists/{name}")
    public Response categoryExists(@PathParam("name") String name) {
        boolean exists = categoryBean.categoryExists(name);
        return Response.ok(exists).build();
    }

    /**
     * Create a new category
     * 
     * @param categoryDto The category to create
     * @return Response containing the created category or 400 if invalid/duplicate
     */
    @POST
    public Response createCategory(CategoryDto categoryDto) {
        if (categoryDto == null || categoryDto.getName() == null || categoryDto.getName().trim().isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Category name is required").build();
        }

        CategoryDto createdCategory = categoryBean.addCategory(categoryDto);
        if (createdCategory == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Category with this name already exists").build();
        }

        return Response.status(Response.Status.CREATED).entity(createdCategory).build();
    }

    /**
     * Update an existing category
     * 
     * @param id          The ID of the category to update
     * @param categoryDto The updated category data
     * @return Response containing the updated category or appropriate error status
     */
    @PUT
    @Path("/{id}")
    public Response updateCategory(@PathParam("id") Long id, CategoryDto categoryDto) {
        if (categoryDto == null || categoryDto.getName() == null || categoryDto.getName().trim().isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Category name is required").build();
        }

        // Ensure ID in path matches the one in DTO
        if (categoryDto.getId() == null) {
            categoryDto.setId(id);
        } else if (!categoryDto.getId().equals(id)) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("ID in path doesn't match ID in category").build();
        }

        CategoryDto updatedCategory = categoryBean.updateCategory(categoryDto);
        if (updatedCategory == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("Category not found or name already in use")
                    .build();
        }

        return Response.ok(updatedCategory).build();
    }

    /**
     * Delete a category
     * 
     * @param id The ID of the category to delete
     * @return Response with 204 No Content if successful or 404 if not found
     */
    @DELETE
    @Path("/{id}")
    public Response deleteCategory(@PathParam("id") Long id) {
        boolean deleted = categoryBean.deleteCategory(id);
        if (!deleted) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.noContent().build();
    }
}