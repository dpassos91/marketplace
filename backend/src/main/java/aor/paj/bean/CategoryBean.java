package aor.paj.bean;

import java.util.List;
import java.util.stream.Collectors;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import aor.paj.dao.CategoryDao;
import aor.paj.dto.CategoryDto;
import aor.paj.entity.CategoryEntity;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class CategoryBean {
    private static final Logger logger = LogManager.getLogger(CategoryBean.class);

    @Inject
    private CategoryDao categoryDao;

    /**
     * Adds a new category to the database
     * 
     * @param categoryDto The category to add
     * @return The added category with ID
     */
    public CategoryDto addCategory(CategoryDto categoryDto) {
        if (categoryDto == null) {
            logger.warn("Attempt to create category with null DTO");
            return null;
        }

        if (categoryDto.getName() == null || categoryDto.getName().trim().isEmpty()) {
            logger.warn("Attempt to create category with empty name");
            return null;
        }

        // Check if category already exists
        if (categoryDao.existsByName(categoryDto.getName())) {
            logger.warn("Category creation failed: name '{}' already exists", categoryDto.getName());
            return null;
        }

        try {
            CategoryEntity categoryEntity = convertDtoToEntity(categoryDto);
            CategoryEntity savedCategory = categoryDao.create(categoryEntity);
            logger.info("Category created successfully: id={}, name='{}'",
                    savedCategory.getId(), savedCategory.getName());
            return convertEntityToDto(savedCategory);
        } catch (Exception e) {
            logger.error("Error creating category: {}", categoryDto.getName(), e);
            return null;
        }
    }

    /**
     * Gets a category by its ID
     * 
     * @param id The ID of the category
     * @return The category DTO or null if not found
     */
    public CategoryDto getCategoryById(long id) {
        CategoryEntity category = categoryDao.findById(id);
        return convertEntityToDto(category);
    }

    /**
     * Gets a category by its name
     * 
     * @param name The name of the category
     * @return The category DTO or null if not found
     */
    public CategoryDto getCategoryByName(String name) {
        CategoryEntity category = categoryDao.findByName(name);
        return convertEntityToDto(category);
    }

    /**
     * Gets all categories from the database
     * 
     * @return List of category DTOs
     */
    public List<CategoryDto> getAllCategories() {
        List<CategoryEntity> entities = categoryDao.findAll();
        return entities.stream()
                .map(this::convertEntityToDto)
                .collect(Collectors.toList());
    }

    /**
     * Gets categories with pagination
     * 
     * @param page     The page number (0-based)
     * @param pageSize The number of items per page
     * @return List of category DTOs for the requested page
     */
    public List<CategoryDto> getCategoriesPaginated(int page, int pageSize) {
        logger.debug("Querying paginated categories: page={}, size={}", page, pageSize);
        long startTime = System.currentTimeMillis();

        try {
            int offset = page * pageSize;
            List<CategoryEntity> entities = categoryDao.findAllPaginated(offset, pageSize);
            List<CategoryDto> result = entities.stream()
                    .map(this::convertEntityToDto)
                    .collect(Collectors.toList());

            long duration = System.currentTimeMillis() - startTime;
            logger.debug("DB Query: Retrieved {} categories for page {}, time taken: {}ms",
                    result.size(), page, duration);

            return result;
        } catch (Exception e) {
            logger.error("DB Error: Failed to get paginated categories: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Get total count of categories
     * 
     * @return Total number of categories
     */
    public Long getCategoryCount() {
        logger.debug("Querying total count of categories");
        long startTime = System.currentTimeMillis();

        try {
            Long count = categoryDao.count();
            long duration = System.currentTimeMillis() - startTime;

            if (duration > 500) { // Log slow queries with WARN
                logger.warn("DB Query slow: Category count query took {}ms", duration);
            } else {
                logger.debug("DB Query: Category count={}, time taken: {}ms", count, duration);
            }

            return count;
        } catch (Exception e) {
            logger.error("DB Error: Failed to get category count: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Updates an existing category
     * 
     * @param categoryDto The updated category information
     * @return The updated category DTO or null if not found
     */
    public CategoryDto updateCategory(CategoryDto categoryDto) {
        if (categoryDto == null || categoryDto.getId() == null) {
            return null;
        }

        // Check if category exists
        CategoryEntity existingCategory = categoryDao.findById(categoryDto.getId());
        if (existingCategory == null) {
            return null;
        }

        // Check if name is already in use by another category
        if (!existingCategory.getName().equals(categoryDto.getName())) {
            CategoryEntity categoryWithSameName = categoryDao.findByName(categoryDto.getName());
            if (categoryWithSameName != null && !categoryWithSameName.getId().equals(categoryDto.getId())) {
                return null; // Another category is already using this name
            }
        }

        // Update the category entity
        existingCategory.setName(categoryDto.getName());

        // Save the updated entity
        CategoryEntity updatedCategory = categoryDao.update(existingCategory);

        // Return the updated entity as DTO
        return convertEntityToDto(updatedCategory);
    }

    /**
     * Deletes a category by its ID
     * 
     * @param id The ID of the category to delete
     * @return true if successful, false otherwise
     */
    public boolean deleteCategory(long id) {
        return categoryDao.delete(id);
    }

    /**
     * Checks if a category with the given name already exists
     * 
     * @param name The category name to check
     * @return true if exists, false otherwise
     */
    public boolean categoryExists(String name) {
        return categoryDao.existsByName(name);
    }

    /**
     * Converts a category entity to a DTO
     * 
     * @param entity The category entity to convert
     * @return The corresponding DTO or null if entity is null
     */
    private CategoryDto convertEntityToDto(CategoryEntity entity) {
        if (entity == null) {
            logger.trace("Attempting to convert null category entity to DTO");
            return null;
        }

        try {
            CategoryDto dto = new CategoryDto();
            dto.setId(entity.getId());
            dto.setName(entity.getName());
            return dto;
        } catch (Exception e) {
            logger.error("Error converting category entity to DTO: id={}",
                    entity.getId(), e);
            throw e;
        }
    }

    /**
     * Converts a category DTO to an entity
     * 
     * @param dto The category DTO to convert
     * @return The corresponding entity or null if DTO is null
     */
    private CategoryEntity convertDtoToEntity(CategoryDto dto) {
        if (dto == null) {
            return null;
        }

        CategoryEntity entity = new CategoryEntity();
        // Only set ID if it's an existing category (for updates)
        if (dto.getId() != null) {
            entity.setId(dto.getId());
        }
        entity.setName(dto.getName());
        return entity;
    }
}