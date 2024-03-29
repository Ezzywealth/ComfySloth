import React from 'react';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '../utils/helpers';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { getError } from '../utils/error';
import axios from 'axios';
import { useState } from 'react';
import { clearShoppingCart } from '../Slices/cartSlice';
import { useEffect } from 'react';

const PlaceOrder = () => {
  const userProfile = useSelector((state) => state.cartSlice.user);

  //disabbling server side rendering
  const [ssr, setSsr] = useState(true);
  useEffect(() => {
    setSsr(false);
  }, []);

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const shippingAddress = useSelector(
    (state) => state.cartSlice.cart.shippingAddress
  );
  const paymentMethod = useSelector(
    (state) => state.cartSlice.cart.paymentMethod
  );
  const cartItems = useSelector((state) => state.cartSlice.cart.cartItems);

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  const itemsPrice = round2(
    cartItems.reduce((acc, cur) => acc + cur.price * cur.quantity, 0)
  );

  const taxPrize = itemsPrice * 0.15;
  const shippingPrice = itemsPrice < 500 ? 0 : 15;

  const total = itemsPrice + taxPrize + shippingPrice;

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/order', {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrize,
        shippingPrice,
        total,
        ...userProfile,
      });
      setLoading(false);
      router.push(`/order/${data._id}`);
      dispatch(clearShoppingCart());
    } catch (error) {
      toast.error(getError(error));
      setLoading(false);
    }
  };

  if (ssr) return;

  return (
    <Layout title='place order'>
      <CheckoutWizard activeStep={3} />
      <div className=' mx-4 md:mx-16 my-8'>
        <h3 className='font-semibold'>Place Order</h3>
        <main className='grid grid-cols-1 md:grid-cols-4 mt-4  md:gap-8'>
          <section className='col-span-3 '>
            <div className='card mb-4 p-6 '>
              <h4 className=' font-semibold'>Shipping Address</h4>
              <div className='text-2xl my-2'>
                {shippingAddress.name}, {shippingAddress.address},{' '}
                {shippingAddress.city}, {shippingAddress.country},{' '}
                {shippingAddress.postalcode}
              </div>
              <button
                className='text-blue-500 text-2xl font-semibold'
                onClick={() => router.push('/shipping')}
              >
                Edit
              </button>
            </div>
            <div className='card mb-4 p-5'>
              <h4 className=' font-semibold'>Payment Method</h4>
              <div className='text-2xl my-2'>{paymentMethod}</div>
              <button
                className='text-blue-500 text-2xl font-semibold'
                onClick={() => router.push('/payment')}
              >
                Edit
              </button>
            </div>
            <div className='card mb-4 p-3 overflow-auto'>
              <h4 className='p-5 font-semibold'>Order Items</h4>
              <table className='min-w-full mx-auto'>
                <thead className='border-b'>
                  <tr className='font-bold text-2xl'>
                    <td className='p-5 text-left flex gap-4'>Item</td>
                    <td className='text-center p-3'>Quantity</td>
                    <td className='text-center p-3'>Price</td>
                    <td className='text-center p-3'>Subtotal</td>
                  </tr>
                </thead>

                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id} className='border-b text-xl font-normal'>
                      <td className='p-5 text-left flex gap-4 '>
                        <div className='flex items-center gap-2'>
                          <div className='h-20 w-20'>
                            <Link href={`/products/${item.id}`}>
                              <a className='flex flex-1'>
                                <Image
                                  src={item.images[0].url}
                                  alt={item.name}
                                  height='200px'
                                  width='200px'
                                  layout='intrinsic'
                                  className='rounded-md'
                                />
                              </a>
                            </Link>
                          </div>
                          <p className='text-blue-500 capitalize '>
                            {item.name}
                          </p>
                        </div>
                      </td>

                      <td className='text-center p-3'>{item.quantity}</td>
                      <td className='text-center p-3 tracking-widest'>
                        {formatPrice(item.price)}
                      </td>
                      <td className='text-center p-3 tracking-widest'>
                        {formatPrice(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                className='text-blue-500 text-2xl font-semibold p-3'
                onClick={() => router.push('/cart')}
              >
                Edit
              </button>
            </div>
          </section>
          <section className='col-span-1 mt-4 md:mt-0 '>
            <section className='card mb-4 min-w-full p-5 '>
              <h4 className='my-4 font-bold text-center'>Order Summary</h4>
              <div className='mb-4 text-xl font-normal flex justify-between'>
                <span>Items</span>
                <span className='tracking-widest'>
                  {formatPrice(itemsPrice)}
                </span>
              </div>
              <div className='mb-4 text-xl font-normal flex justify-between'>
                <span>Tax</span>
                <span className='tracking-widest'>{formatPrice(taxPrize)}</span>
              </div>
              <div className='mb-4 text-xl font-normal flex justify-between'>
                <span>Shipping</span>
                <span className='tracking-widest'>
                  {formatPrice(shippingPrice)}
                </span>
              </div>
              <hr />
              <div className='mb-4 mt-4 text-xl font-semibold flex justify-between'>
                <span>Total</span>
                <span className='tracking-widest'>{formatPrice(total)}</span>
              </div>
              <button
                className='primary-button w-full mb-4 text-xl'
                onClick={handlePlaceOrder}
              >
                {loading ? 'Loading.....' : 'Place Order'}
              </button>
            </section>
          </section>
        </main>
      </div>
    </Layout>
  );
};

export default PlaceOrder;

PlaceOrder.auth = true;
