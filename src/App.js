import React, { useEffect, useRef, useState } from 'react';
import { data } from './cosnstants';

const App = () => {
	const [mounted, setMounted] = useState(false);
	const [slider, setSlider] = useState();
	const [autoStart] = useState(false);
	const [current, setCurrent] = useState(0);
	const [imageSize, setImageSize] = useState('');
	const [ sliderWidth, setSliderWidth ] = useState('');
	const [sliderItems, setSliderItems] = useState(data)
	const sliderRef = useRef(null);
	const leftButton = useRef();
	const rightButton = useRef();

	useEffect(() => {
		const handleMount = setMounted(true);
		return () => handleMount;
	}, []);

	useEffect(() => {
		const handleSliderWidth =
			mounted && setSliderWidth(sliderRef?.current?.offsetWidth);

		return () => handleSliderWidth;
	}, [mounted]);

	const changeWidth = () => {
		setSliderWidth(sliderRef?.current?.offsetWidth);
	};

	useEffect(() => {
		window.addEventListener('resize', () => changeWidth());
		return () => window.removeEventListener('resize', changeWidth());
	}, []);

	useEffect(() => {
		const handleImageSize = () => {
			if (sliderWidth < 500) setImageSize(sliderWidth);
			else if (sliderWidth > 500 && sliderWidth < 1000)
				setImageSize(sliderWidth / 2);
			else if (sliderWidth > 1000 && sliderWidth < 1300)
				setImageSize(sliderWidth / 3);
			else setImageSize(sliderWidth / 3);
		};
		handleImageSize();
		return () => handleImageSize();
	}, [sliderWidth]);

	useEffect(() => {
		const handleSlider = mounted && setSlider(sliderRef.current);
		return () => handleSlider;
	}, [mounted]);

	let slideInterval;
	let intervalTime = 3000;

	const start = () => {
		moveRight();
		moveSlide();
	};

	const autoSlide = () => {
		moveSlide();
		slideInterval = setInterval(start, intervalTime);
	};

	useEffect(() => {
		autoStart && autoSlide();
		return () => clearInterval(slideInterval);
		//eslint-disable-next-line
	}, [current]);

	const moveSlide = () => {
		current >= data.length / 3 - 1 && setCurrent(0);

		if (slider)
			slider.style.transform = `translateX(${
				(-current * sliderWidth) / 3
			}px)`;
	};

	const moveRight = () => {
		current < data.length / 2
			? setCurrent(current + 1)
			: setCurrent(0);
	};

	const handleNavigation = direction => {
		if (direction === 'right') {
			moveRight();
		} else {
			if (current > 0) {
				setCurrent(current - 1);
			} else if (current === 0) {
				setCurrent(data.length / 3 - 1);
			}
		}
		moveSlide();
	};

	if (!mounted) {
		return (
			<div className='flex items-center justify-center h-screen w-screen'>
				Loading..
			</div>
		);
	}

	return (
		<div className='flex items-center justify-center w-screen h-screen bg-gradient-to-b from-black via-blue-900 to-black text-white'>
			<div className='relative overflow-hidden h-screen w-screen bg-transparent'>
				<div
					ref={sliderRef}
					className='absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center transition-all duration-[0.5s] ease-in-out bg-blend-multiply shadow-xl container'
				>
					{data.map(item => (
						<img
							key={item.id}
							src={item.source}
							width={`${imageSize}px`}
							height={`${imageSize}px`}
							alt=''
							className='h-[15rem] sm:h-[17rem] object-cover z-0'
						/>
					))}
				</div>
				<div className='absolute top-0 bottom-0 left-0 right-0 flex items-center justify-between'>
					<Button
						ref={leftButton}
						onClick={() => handleNavigation('left')}
						icon={<ChevronLeft />}
					/>

					<Button
						ref={rightButton}
						onClick={() => handleNavigation('right')}
						icon={<ChevronRight />}
					/>
				</div>
			</div>
		</div>
	);
};

export default App;

const Button = ({ onClick, icon }) => {
	return (
		<button
			type='button'
			className='bg-[white]/20 px-4 py-2.5 opacity-50 hover:opacity-100 text-lg font-bold h-full shadow-xl'
			onClick={onClick}
		>
			{icon}
		</button>
	);
};

const ChevronLeft = () => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		fill='none'
		viewBox='0 0 24 24'
		strokeWidth={2}
		stroke='currentColor'
		className='w-6 h-6 sm:w-9 sm:h-9'
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='M15.75 19.5L8.25 12l7.5-7.5'
		/>
	</svg>
);

const ChevronRight = () => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		fill='none'
		viewBox='0 0 24 24'
		strokeWidth={2}
		stroke='currentColor'
		className='w-6 h-6 sm:w-9 sm:h-9'
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='M8.25 4.5l7.5 7.5-7.5 7.5'
		/>
	</svg>
);
