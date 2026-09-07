
interface Blog {
  id: number;
  image: string;
  author: string;
  date: string;
  title: string;
}

const blogs: Blog[] = [
  {
    id: 1,
    image: "/assets/blog/blog_1_1.jpg",
    author: "Michel Smith",
    date: "24 Feb , 2025",
    title: "Top 20 Smartwatches Rated Rollable Just Tipped",
  },
  {
    id: 2,
    image: "/assets/blog/blog_1_2.jpg",
    author: "Michel Smith",
    date: "24 Feb , 2025",
    title:
      "The Ultimate Guide To Marketing Strategies to Improve Sales",
  },
  {
    id: 3,
    image: "/assets/blog/blog_1_3.jpg",
    author: "Michel Smith",
    date: "24 Feb , 2025",
    title:
      "50 Sales Questions to Determine Your Customer’s Needs",
  },
  {
    id: 4,
    image: "/assets/blog/blog_1_4.jpg",
    author: "Michel Smith",
    date: "24 Feb , 2025",
    title:
      "10 Content Marketing Trends and Ideas to Increase Traffic",
  },
];

export default function LatestNews() {
  return (
    <section
      id="blog-sec"
      className="overflow-hidden py-16 lg:py-20"
    >
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-6 flex flex-col items-center justify-between gap-4 lg:flex-row">

          {/* Title */}
          <div className="w-full lg:w-auto">
            <h2 className="text-center text-2xl font-bold leading-tight text-gray-900 sm:text-3xl lg:text-left">
              Latest News & Updates
            </h2>
          </div>

          {/* Explore All */}
          <div className="w-full text-center lg:w-auto lg:text-right">
            <a
              href="/contact"
              className="inline-block border-b border-gray-900 pb-1 text-sm font-medium text-gray-900 transition-all duration-300 hover:border-gray-500 hover:text-gray-500"
            >
              Explore All
            </a>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mb-8 h-px w-full bg-gray-200" />

        {/* Blog Grid */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-4">

          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="group"
            >
              {/* Image */}
              <a
                href="/blog-details"
                className="relative block overflow-hidden"
              >
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="h-[250px] w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-[280px] xl:h-[230px]"
                />
              </a>

              {/* Content */}
              <div className="pt-5">

                {/* Meta */}
                <div className="mb-3 flex items-center gap-4 text-sm text-gray-500">
                  <a
                    href="/blog"
                    className="transition-colors hover:text-gray-900"
                  >
                    By {blog.author}
                  </a>

                  <span className="h-1 w-1 rounded-full bg-gray-400" />

                  <a
                    href="/blog"
                    className="transition-colors hover:text-gray-900"
                  >
                    {blog.date}
                  </a>
                </div>

                {/* Title */}
                <h3 className="mb-4 min-h-[56px] text-lg font-semibold leading-7 text-gray-900">
                  <a
                    href="/blog-details"
                    className="transition-colors duration-300 hover:text-gray-600"
                  >
                    {blog.title}
                  </a>
                </h3>

                {/* Read More */}
                <a
                  href="/blog-details"
                  className="inline-block border-b border-gray-900 pb-1 text-sm font-medium text-gray-900 transition-all duration-300 hover:border-gray-500 hover:text-gray-500"
                >
                  Read More
                </a>

              </div>
            </article>
          ))}

        </div>
      </div>
    </section>
  );
}
