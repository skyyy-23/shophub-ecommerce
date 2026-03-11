function CartNotification({ message }) {
  if (!message) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-start justify-center pt-6">
      <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
        {message}
      </div>
    </div>
  );
}

export default CartNotification;
