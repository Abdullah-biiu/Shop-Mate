import CountUp from "react-countup";

const StatsCard = ({
  title,
  value,
  icon,
  color,
}) => {
  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-lg">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-slate-400 text-sm">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2">

            <CountUp
              end={value || 0}
              duration={1}
            />

          </h2>

        </div>

        <div
          className={`p-4 rounded-xl ${color}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
};

export default StatsCard;