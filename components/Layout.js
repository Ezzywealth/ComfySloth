/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import React, { useState } from "react";
import { links } from "../utils/constants";
import Link from "next/link";
import CartButtons from "./CartButtons";
import { AiOutlineMenuFold } from "react-icons/ai";
import Sidebar from "./SIdebar";

const Layout = ({ children, title }) => {
  const [isMenu, setIsMenu] = useState(false);
  return (
    <div className='relative'>
      <Head>
        <title>{title ? title : "Zicomm2.0"}</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='flex  flex-col w-full min-h-screen justify-between '>
        <header className=' '>
          <nav className='relative flex justify-between p-4 items-center h-20  '>
            <div className='text-5xl'>
              <Link href='/'>
                <a className='pointer'>
                  <img src='/logo.svg' alt='Logo' width='175px' height='80px' />
                </a>
              </Link>
            </div>

            <div
              className='flex md:hidden text-5xl mr-2 font-bold text-[#ab7a5f]'
              onClick={() => setIsMenu(true)}
            >
              <AiOutlineMenuFold />
            </div>

            <ul className=' hidden  md:flex  items-center gap-4 capitalize'>
              {links.map((link) => (
                <li key={link.id}>
                  <Link href={link.url}>
                    <a>{link.text}</a>
                  </Link>
                </li>
              ))}
            </ul>
            <div className=' hidden  md:flex'>
              <CartButtons />
            </div>
          </nav>
          <main>{children}</main>
        </header>

        <div
          className={`w-screen absolute top-0  h-screen bg-white md:hidden transition duration-500 ease-linear ${
            isMenu ? "translate-x-0  " : "-translate-x-full"
          }`}
        >
          <Sidebar isMenu={isMenu} setIsMenu={setIsMenu} />
        </div>

        <footer className='footer bg-[#222]'>
          <div>
            <p className='text-white'>
              &copy; {new Date().getFullYear()} Zicomm2.0 All rights reserved
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
