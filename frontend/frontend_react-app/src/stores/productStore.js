import { create } from 'zustand';
import { PRODUCT_STATES } from '../api/productStates';

const useProductStore = create((set) => ({
  product: null,
  setProduct: (productData) => set({ product: productData }),
  updateProductState: (newState) => set((state) => ({
    product: state.product ? {
      ...state.product,
      status: PRODUCT_STATES.fromDescription(newState).description
    } : null
  })),
  clearProduct: () => set({ product: null }),
}));

export default useProductStore;
