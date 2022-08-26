import React, { useEffect } from "react";
import Layout from "../../components/Layout";
import { useSelector, useDispatch } from "react-redux";
import { wrapper } from "../../app/Store";
import { fetchProducts } from "../../Slices/productSlice";
import ProductFilters from "../../components/ProductFilters";
import ProductsSorts from "../../components/ProductsSorts";
import ProductsGridView from "../../components/ProductsGridView";
import ProductsListView from "../../components/ProductsListView";
import HeroSection from "../../components/HeroSection";

const Products = () => {
  const products = useSelector((state) => state.productSlice.filtered_products);
  const state = useSelector((state) => state.productSlice);
  const grid_view = useSelector((state) => state.productSlice.grid_view);
  const list_view = useSelector((state) => state.productSlice.list_view);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, []);
  return (
    <div>
      <Layout title='products'>
        <HeroSection title='products' />
        <div className=' productPageView md:px-32 relative gap-16 mt-20 '>
          <div className='h-screen '>
            <div>
              <ProductFilters />
            </div>
          </div>
          <div className=' '>
            <div>
              <ProductsSorts />
            </div>
            {products.length < 1 ? (
              <h4 className='italic bold mt-32'>
                No products for match the search result, try another search
                query....
              </h4>
            ) : (
              <div className='h-screen overflow-auto  '>
                {grid_view && <ProductsGridView />}
                {list_view && <ProductsListView />}
              </div>
            )}
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Products;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    console.log(context);
    store.dispatch(fetchProducts());

    return {
      props: {},
    };
  }
);
