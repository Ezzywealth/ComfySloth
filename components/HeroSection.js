import Link from 'next/link';
import React from 'react';

const HeroSection = ({ singleProduct, title }) => {
	return (
		<div className='bg-[#eaded7] h-20 flex items-center md:text-xl font-bold text-[#453227] p-8 w-full'>
			<Link href='/'>
				<a className='text-[#795744] md:text-3xl'>Home </a>
			</Link>
			&nbsp;/&nbsp;
			<Link href={`/products`}>
				<a>
					<h5 className='md:text-3xl'>{title}</h5>
				</a>
			</Link>
			{singleProduct && <h5> &nbsp;/&nbsp;{singleProduct.name}</h5>}
		</div>
	);
};

export default HeroSection;
