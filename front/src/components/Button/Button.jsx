const sizeClasses = {
    large: 'w-full h-12 max-[768px]:h-10',
    medium: 'w-32 h-10 max-[768px]:h-8 max-[768px]:w-1/3',
    small: 'w-12 h-10 max-[768px]:h-8',
};
  
const typeClasses = {
    primary: 'bg-green-500 text-white font-bold border-green-600 dark:bg-yellow-500 dark:hover:bg-yellow-600 dark:text-black uppercase dark:border-yellow-500',
    secondary: 'bg-transparent border-green-600 text-green-600 font-bold uppercase hover:bg-green-50 dark:text-yellow-500 dark:border-yellow-500 dark:hover:bg-yellow-500 dark:hover:text-black transition-colors',
    tertiary: 'bg-red-400 text-slate-950 font-bold border-red-600',
};
  
export const Button = ({ buttonType = "primary", size = "small", type = "button", onClick, text }) => {
    const sizeClass = sizeClasses[size] || '';
    const typeClass = typeClasses[buttonType] || ''
    return (
      <button
        type={type}
        className={`border ${typeClass} ${sizeClass} rounded-md text-center text-base leading-7 tracking-wide max-[768px]:text-sm`}
        onClick={onClick}
      >
        {text}
      </button>
    );
};
  
  