const Card = ({ title, value }) => {
  return (
    <div className="bg-gray-800 p-5 rounded-lg shadow-md hover:scale-105 transition">
      <h3 className="text-gray-400">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default Card;