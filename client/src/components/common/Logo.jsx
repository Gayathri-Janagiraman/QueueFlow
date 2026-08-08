const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-xl font-bold text-white shadow-md">
        Q
      </div>

      <div>
        <h1 className="text-2xl font-bold text-secondary">
          QueueFlow
        </h1>

        <p className="text-sm text-gray-500">
          Smart Queue Management
        </p>
      </div>
    </div>
  );
};

export default Logo;