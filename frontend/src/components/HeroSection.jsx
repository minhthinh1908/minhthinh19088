import React, { useState } from 'react';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    };

    return (
        <div className='bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16 px-4'>
            <div className='max-w-4xl mx-auto text-center'>
                <div className='mb-6'>
                    <span className='inline-block px-6 py-2 rounded-full bg-white text-blue-600 font-semibold'>Top Job Search Sites</span>
                </div>
                <h1 className='text-4xl md:text-5xl font-bold leading-tight mb-4'>Explore Opportunities <br /> Với <span className='text-yellow-300'>Dream Job</span></h1>
                <p className='text-lg md:text-xl mb-8'>Search thousands of jobs that are right for you from top employers.</p>
                <div className='flex flex-col md:flex-row items-center gap-4'>
                    <input
                        type="text"
                        placeholder='Enter job keywords...'
                        onChange={(e) => setQuery(e.target.value)}
                        className='w-full md:w-3/4 px-4 py-3 rounded-lg text-gray-800 focus:outline-none shadow-lg'
                    />
                    <Button onClick={searchJobHandler} className="w-full md:w-auto px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold rounded-lg shadow-lg">
                        <Search className='h-5 w-5 inline-block mr-2' />Search
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
