const WelcomeBanner = ({ userName }) => {
  return (
    <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl p-8 mb-8 text-white">
      <h1 className="text-3xl font-bold mb-2">Welcome back, {userName}! 👋</h1>
      <p className="text-orange-100">Ready for your next adventure? Check out our latest tours and offers.</p>
    </div>
  );
};

export default WelcomeBanner;