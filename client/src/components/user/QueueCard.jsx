import Button from "../common/Button";

const QueueCard = ({ queue, onBook }) => {
  return (
    <div className="rounded-xl bg-white p-6 shadow-md transition hover:shadow-lg">

      <h2 className="text-xl font-bold text-secondary">
        {queue.name}
      </h2>

      <p className="mt-2 text-gray-600">
        Average Service Time:
        <span className="ml-2 font-semibold text-primary">
          {queue.averageServiceTime} mins
        </span>
      </p>

      <p className="mt-2 text-gray-600">
        Prefix:
        <span className="ml-2 font-semibold">
          {queue.prefix}
        </span>
      </p>

      {/* Daily Booking Stats */}

      <div className="mt-5 rounded-lg bg-gray-50 p-4">

        <div className="flex justify-between">
          <span className="text-gray-600">
            Today's Bookings
          </span>

          <span className="font-semibold">
            {queue.todayBookings} / {queue.dailyLimit}
          </span>
        </div>

        <div className="mt-3 flex justify-between">
          <span className="text-gray-600">
            Remaining Slots
          </span>

          <span
            className={`font-semibold ${
              queue.isFull
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {queue.isFull
              ? "Full"
              : queue.remainingSlots}
          </span>
        </div>

      </div>

      <Button
        className={`mt-5 ${
          queue.isFull
            ? "cursor-not-allowed bg-gray-400 hover:bg-gray-400"
            : ""
        }`}
        onClick={() => onBook(queue)}
        disabled={queue.isFull}
      >
        {queue.isFull
          ? "Today's Slots Full"
          : "Book Token"}
      </Button>

    </div>
  );
};

export default QueueCard;