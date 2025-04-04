import { create } from 'zustand';
import { PRODUCT_STATES } from '../components/product/productStates';

const useProductStore = create((set) => ({
  product: null,
  setProduct: (productData) => set({ product: productData }),

  updateProductState: (newState) => set((state) => {
    console.log('newState recebido:', newState);
    const newProductState = PRODUCT_STATES.fromDescription(newState);
    console.log('Resultado de fromDescription:', newProductState);

    return {
      product: state.product ? {
        ...state.product,
        status: newProductState ? newProductState.description : state.product.status
      } : null
    };
  }),

  clearProduct: () => set({ product: null }),
}));

export default useProductStore;

