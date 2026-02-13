interface PageTitleProps {
  title: string;
}

const PageTitle = ({ title }: PageTitleProps) => {
  return (
    <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
    </div>
  );
};

export default PageTitle;
