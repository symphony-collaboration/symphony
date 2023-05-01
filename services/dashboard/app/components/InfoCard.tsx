interface InfoCardProps {
  title: string,
  description: string,
  link: { text: string, href: string}
}

export default function Card({ title, description, link }: InfoCardProps) {
  return (
    <div className="flex-1">
      <a
        href={link.href}
        className="group flex flex-col justify-between rounded-sm bg-white p-4 shadow-xl transition-shadow hover:shadow-lg sm:p-6 lg:p-8"
      >
        <div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          <div className="border-t-2 border-gray-100 pt-1">
            <p className="mt-1 text-sm text-gray-700">{description}</p>
          </div>
        </div>
        <div className="mt-4 inline-flex items-center gap-2 text-indigo-600">
          <p className="font-medium">{link.text}</p>
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
    </div>
  );
}
