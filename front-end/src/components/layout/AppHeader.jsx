import {
  FiMoon,
  FiPlus,
  FiShoppingBag,
  FiShoppingCart,
  FiSun,
  FiUser,
  FiLogOut,
  FiLogIn,
} from "react-icons/fi";

function AppHeader({
  darkMode,
  cartCount,
  user,
  onOpenAddProduct,
  onToggleCart,
  onToggleTheme,
  onLogin,
  onAdminLogin,
  onLogout,
}) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FiShoppingBag className="text-white text-xl" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              ShopHub
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4">
            {user && user.role === 'admin' && (
              <button
                onClick={onOpenAddProduct}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-3 py-2 text-xs sm:text-sm md:text-base rounded-lg shadow"
              >
                <FiPlus />
                Add Product
              </button>
            )}

            <button
              onClick={onToggleCart}
              className="relative p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FiShoppingCart className="text-xl sm:text-2xl text-green-400" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <FiUser className="text-gray-600 dark:text-gray-400" />
                  <span className="hidden sm:inline text-gray-700 dark:text-gray-300 font-medium">
                    {user.name}
                  </span>
                  {user.role === 'admin' && (
                    <span className="hidden sm:inline-flex bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs px-2 py-1 rounded-full font-medium">
                      Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={onLogout}
                  className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-2 text-xs sm:text-sm md:text-base rounded-lg shadow"
                >
                  <FiLogOut />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onLogin}
                  className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-3 py-2 text-xs sm:text-sm md:text-base rounded-lg shadow"
                >
                  <FiLogIn />
                  Login
                </button>
                {onAdminLogin && (
                  <button
                    onClick={onAdminLogin}
                    className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white font-semibold px-3 py-2 text-xs sm:text-sm md:text-base rounded-lg shadow"
                  >
                    <FiLogIn />
                    Admin Login
                  </button>
                )}
              </div>
            )}

            <button
              onClick={onToggleTheme}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-lg sm:text-xl"
            >
              {darkMode ? <FiSun className="text-white" /> : <FiMoon className="text-black-400" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
