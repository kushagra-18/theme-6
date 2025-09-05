const TaglineBlock = () => {
  return (
    <div className="bg-base-200 rounded-lg my-16">
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Your trusted source</h2>
        <p className="mt-4 text-lg text-base-content/70">
          Wide-ranging perspectives, thought-provoking analysis, and deep insights that resonate.
        </p>
        <div className="mt-6">
          <button className="btn btn-primary rounded-full">Subscribe now</button>
        </div>
      </div>
    </div>
  );
};

export default TaglineBlock;
