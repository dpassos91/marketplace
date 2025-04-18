import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { productAPI } from '../api/productAPI';
import ProductCard from '../components/product/ProductCard';
import SpinnerLeaf from '../components/commons/SpinnerLeaf';
import Pagination from '../components/commons/Pagination';
import useMediaType from '../hooks/useMediaType';
import usePaginationTable from '../hooks/usePaginationTable';
import './ProductPage.css';

const PRODUCTS_PER_PAGE = 10;

function ProductPage() {
  const { isMobile } = useMediaType();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');
  const categoryId = searchParams.get('categoria');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const fetchedProducts = categoryId
          ? await productAPI.getProductsByCategory(categoryId)
          : await productAPI.getAllActiveProducts();

        setProducts(fetchedProducts);

        if (categoryId && fetchedProducts.length > 0) {
          setCategoryName(fetchedProducts[0].categoryName);
        } else if (categoryId) {
          const categoryData = await productAPI.getCategoryById(categoryId);
          setCategoryName(categoryData.name);
        }
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  const {
    currentPage,
    totalPages,
    paginatedItems,
    handlePageChange
  } = usePaginationTable(products, PRODUCTS_PER_PAGE);

  if (loading) {
    return (
      <div className="centered-message">
        <SpinnerLeaf />
        <p>
          <FormattedMessage id="productPage.loading" defaultMessage="Carregando produtos..." />
        </p>
      </div>
    );
  }

  return (
    <div className={`main-content ${isMobile ? 'mobile' : ''}`}>
      <h1 className="product-list-title">
        {categoryId ? (
          <FormattedMessage
            id="productPage.categoryTitle"
            defaultMessage="Produtos da Categoria {categoryName}"
            values={{ categoryName }}
          />
        ) : (
          <FormattedMessage id="productPage.allTitle" defaultMessage="Todos os Produtos" />
        )}
      </h1>

      {products.length === 0 ? (
        <div className="empty-products">
          <img src="/img/sem-produtos.png" alt="Sem produtos" />
          <p>
            <FormattedMessage
              id="productPage.noneAvailable"
              defaultMessage="Nenhum produto disponível encontrado."
            />
          </p>
        </div>
      ) : (
        <>
          <div className="product-list">
            {paginatedItems.map(product => (
              <ProductCard key={product.id} product={product} isMobile={isMobile} />
            ))}
          </div>

          <div className="pagination-container">
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default ProductPage;





