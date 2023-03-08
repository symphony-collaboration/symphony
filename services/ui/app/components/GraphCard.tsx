export default function GraphCard() {
  return (
    <a
      href="#"
      className="group flex flex-col justify-between rounded-sm bg-white p-4 shadow-xl transition-shadow hover:shadow-lg sm:p-6 lg:p-8"
    >
      <div>
        <h3 className="text-3xl font-bold text-indigo-600 sm:text-5xl">100+</h3>

        <div className="mt-4 border-t-2 border-gray-100 pt-4">
          <p className="text-sm font-medium uppercase text-gray-500">
            New employees
          </p>
        </div>
      </div>

      <div className="mt-8 inline-flex items-center gap-2 text-indigo-600 sm:mt-12 lg:mt-16">
        <p className="font-medium sm:text-lg">How we did it</p>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 transition group-hover:translate-x-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </div>
    </a>
  );
}
