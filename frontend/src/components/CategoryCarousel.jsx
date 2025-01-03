import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';

const categories = [
    "Frontend Programming",
    "Backend Programming",
    "Data Science",
    "Graphic Design",
    "FullStack Programming"
];

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    };

    return (
        <div className='py-16 bg-gray-100'>
            <h2 className='text-center text-3xl font-bold text-gray-800 mb-8'>Explore Careers</h2>
            <Carousel className="w-full max-w-5xl mx-auto relative">
                <CarouselContent className="flex gap-6 px-4">
                    {
                        categories.map((category, index) => (
                            <CarouselItem key={index} className="flex-shrink-0 w-64">
                                <Button 
                                    onClick={() => searchJobHandler(category)} 
                                    variant="outline" 
                                    className="w-full py-4 bg-white hover:bg-blue-100 text-gray-800 rounded-lg shadow-md font-medium"
                                >
                                    {category}
                                </Button>
                            </CarouselItem>
                        ))
                    }
                </CarouselContent>
                <CarouselPrevious className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white rounded-full shadow-lg p-2 hover:bg-gray-200" />
                <CarouselNext className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white rounded-full shadow-lg p-2 hover:bg-gray-200" />
            </Carousel>
        </div>
    );
};

export default CategoryCarousel;
