/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { menuState } from '../Slices/productSlice';
import { useRouter } from 'next/router';
import { TiArrowSortedDown } from 'react-icons/ti';
import { Menu } from '@headlessui/react';
import { useSession } from 'next-auth/react';
import Button from './Button';
import { signOut } from 'next-auth/react';

const menuList = ['profile', 'orderHistory', 'Log out'];

const CartButtons = () => {
	const router = useRouter();
	const { data: session } = useSession();

	const [cartQuantity, setCartQuantity] = useState();
	const dispatch = useDispatch();
	const cart = useSelector((state) => state.cartSlice.cart.cartItems);

	useEffect(() => {
		setCartQuantity(cart.reduce((acc, cur) => acc + +cur.quantity, 0));
	}, [cart]);

	const handleSignOut = async () => {
		const data = await signOut({ redirect: false, callbackUrl: '/' });
		router.push(data.url);
		dispatch(menuState());
	};

	const handleMenu = (item) => {
		router.push(`/${item}`);
		dispatch(menuState());
	};

	const handleSignIn = () => {
		router.push('/login');
	};

	return (
		<div>
			<ul className='flex gap-8 items-center'>
				<li onClick={() => dispatch(menuState())}>
					<Link href='/cart'>
						<a className='flex items-center text-2xl md:text-xl'>
							<h4>Cart</h4>
							<span className='text-xl relative'>
								<FaShoppingCart />
								{cartQuantity >= 1 && <span className='absolute -top-3 -right-3 flex text-white text-xs bg-[#ab7a5f] rounded-full h-6 w-6 justify-center items-center'>{cartQuantity}</span>}
							</span>
						</a>
					</Link>
				</li>
				<li>
					{session?.user?.name ? (
						<div className='flex gap-4 items-center'>
							<div className='flex items-center gap-1'>
								<h5>{session?.user.name.split(' ')[0]}</h5>
								<Menu as='div' className='relative inline-block text-left'>
									<Menu.Button className='inline-flex w-full justify-center rounded-md py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 '>
										<TiArrowSortedDown className=' text-violet-500 hover:text-violet-100 text-2xl' aria-hidden='true' />
									</Menu.Button>
									<Menu.Items className='absolute flex flex-col py-3 right-0 mt-2 w-56 origin-top-right  rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 transition-all duration-1000 ease-linear'>
										{menuList.map((item, index) => (
											<Menu.Item key={index} className='p-2 hover:bg-gray-200 flex justify-start transition-all duration-300 ease-linear'>
												<button className='flex justify-start p-2 hover:bg-gray-200 text-blue-500 transition-all duration-300 ease-linear' onClick={item === 'Log out' ? () => handleSignOut() : () => handleMenu(item)}>
													{item}
												</button>
											</Menu.Item>
										))}
									</Menu.Items>
								</Menu>
							</div>
						</div>
					) : (
						<Button title='Sign In' py={2} px={6} onClick={() => handleSignIn()} />
					)}
				</li>
			</ul>
		</div>
	);
};

export default CartButtons;
