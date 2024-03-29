import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useSelector, useDispatch } from 'react-redux';
import HeroSection from '../../components/HeroSection';
import Image from 'next/image';
import { fetchProduct } from '../../Slices/productSlice';
import { BiCheck } from 'react-icons/bi';
import { formatPrice } from '../../utils/helpers';
import Stars from '../../components/Stars';
import { addToCart } from '../../Slices/cartSlice';
import { wrapper } from '../../app/Store';
import { FiMinus } from 'react-icons/fi';
import { HiPlusSm } from 'react-icons/hi';
import { BiCircle } from 'react-icons/bi';
import Link from 'next/link';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { Circles } from 'react-loader-spinner';
import { useEffect } from 'react';

const SingleProductPage = () => {
	const [quantityOrdered, setQuantityOrdered] = useState(1);
	const dispatch = useDispatch();
	const router = useRouter();
	const { id } = router.query;

	const product = useSelector((state) => state.productSlice.product);
	const product_loading = useSelector((state) => state.productSlice.product_loading);

	const { name, stars, company, colors, price, description, stock, reviews } = product;

	useEffect(() => {
		dispatch(fetchProduct(id));
	}, [dispatch, id]);

	// // const [viewImage, setViewImage] = useState('/hero-bcg.jpeg');
	// useEffect(() => {
	// 	images && setViewImage(() => images[0].url);
	// }, [images]);

	const [selectedColor, setSelectedColor] = useState('');
	const handleColorSet = (color) => {
		setSelectedColor(color);
	};

	const handleAddToCart = (product) => {
		dispatch(addToCart({ ...product }));
		toast.success('you just updated your cart item');
	};

	if (product_loading) {
		return (
			<Layout>
				<div className='w-full h-screen flex justify-center items-center  bg-[#f3f0ee] '>
					<Circles height='150' width='150' color='#cea792' ariaLabel='circles-loading' wrapperStyle={{}} wrapperClass='' visible={true} />
				</div>
			</Layout>
		);
	}

	return (
		<div>
			<Layout title={`Product ${id}`}>
				<ToastContainer position='top-center' limit={1} />
				<HeroSection singleProduct={product} title='products' />
				<div className='p-8 md:p-20 lg:px-32 xl:px-48'>
					<Link href='/products'>
						<button className='bg-[#ab7a5f] transition-all duration-300 ease-linear hover:scale-105 hover:bg-[#cea792] text-white px-6 tracking-widest mb-10 rounded-md text-xl py-4'>back to product</button>
					</Link>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4 '>
						<div className=''>
							<Image src='https://images.unsplash.com/photo-1618221710640-c0eaaa2adb49?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZnVybml0dXJlc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=400&q=60' alt={name} height={600} width={600} className='rounded-lg' />
							{/* <div className='flex gap-4 mt-4'>
								{images?.map((item, index) => (
									<div key={item.id} className='h-15 flex-1'>
										<Image src={item.url} alt={item.name} height={100} width={100} layout='responsive' className='rounded-lg' onClick={() => setViewImage(images[index].url)} />
									</div>
								))}
							</div> */}
						</div>
						<div className='flex flex-col'>
							<h3 className='flex-1 m-0 font-bold'>{name}</h3>
							<h4 className='flex-1 m-0 flex gap-4'>
								<Stars stars={stars} /> ({reviews} customer reviews)
							</h4>
							<div className='flex-1 font-semibold text-[#ab7a5f]'>{formatPrice(price)}</div>
							<div className='flex-2 '>{description}</div>
							<div className='flex capitalize items-center flex-1 gap-8'>
								<span className='font-bold'>Available:</span>
								{stock > 1 ? <h6>In Stock</h6> : <h6>Out of Stock</h6>}
							</div>
							<div className='flex-1 flex capitalize gap-8'>
								<span className='font-bold'>SKU:</span> <span>{id}</span>
							</div>
							<div className='flex-1 flex capitalize gap-8'>
								<span className='font-bold'>Brand:</span> {company}
							</div>
							<hr />
							<div className='flex capitalize items-center gap-4 flex-1 '>
								<span className='font-bold'>Colors:</span>
								<div className='flex gap-2'>
									{colors?.map((color) => (
										<span key={color} className={` flex justify-center rounded-full text-white  items-center `} onClick={() => handleColorSet(color)}>
											{selectedColor === color ? (
												<BiCheck
													style={{
														background: color,
														height: '1.5rem',
														width: '1.5rem',
														borderRadius: '50%',
														opacity: 1,
													}}
												/>
											) : (
												<BiCircle
													style={{
														background: color,
														height: '1.5rem',
														width: '1.5rem',
														borderRadius: '50%',
														opacity: 0.5,
													}}
												/>
											)}
										</span>
									))}
								</div>
							</div>

							<div className='flex gap-4 items-center flex-1'>
								<button
									onClick={() =>
										setQuantityOrdered(() => {
											if (quantityOrdered === 1) {
												return quantityOrdered;
											}
											if (quantityOrdered > 1) {
												return quantityOrdered - 1;
											}
										})
									}>
									<FiMinus />
								</button>
								<h3 className='text-base font-bold'>{quantityOrdered}</h3>
								<button
									onClick={() =>
										setQuantityOrdered(() => {
											if (quantityOrdered >= stock) {
												alert('You have exceeded the number of items in stock');
												return quantityOrdered;
											}
											if (quantityOrdered < stock) {
												return quantityOrdered + 1;
											}
										})
									}>
									<HiPlusSm />
								</button>
							</div>
							<div>
								{stock > 0 ? (
									<button
										className='bg-[#ab7a5f] transition-all duration-300 ease-linear hover:scale-105 hover:bg-[#cea792] text-white capitalize px-6 md:px-12 tracking-widest rounded-md py-2 mt-4 md:py-4'
										onClick={() =>
											handleAddToCart({
												...product,
												quantity: quantityOrdered,
												selectedColor,
											})
										}>
										add to cart
									</button>
								) : (
									<div className='flex flex-col justify-start mt-4'>
										<span className='font-semibold text-lg'>
											{' '}
											out of stock, back to
											<Link href='/products'>
												<a className='text-blue-500'> products</a>
											</Link>
										</span>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</Layout>
		</div>
	);
};

export default SingleProductPage;

export const getServerSideProps = wrapper.getServerSideProps((store) => (context) => {
	const { slug } = context.params;

	try {
		slug && store.dispatch(fetchProduct(`${slug}`));
	} catch (error) {
		console.log(error);
	}

	return {
		props: {},
	};
});
