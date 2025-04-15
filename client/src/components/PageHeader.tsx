import BackButton from "./BackButton";

interface PageHeaderProps {
  title: string;
  description: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <>
      {/* Header */}
      <header className="pt-8 pb-4 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <BackButton />
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 gradient-text">
              {title}
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-10 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </section>
    </>
  );
} 