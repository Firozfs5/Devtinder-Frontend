import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { useNavigate } from "react-router-dom";

const Connections = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const connections = useSelector((store) => store.connections);

  const getConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });

      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getConnections();
  }, []);

  if (!connections) {
    return (
      <div className="min-h-[calc(100vh-74px)] bg-[#1b222a] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-74px)] bg-[#1b222a] px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Your Connections</h1>

          <p className="text-gray-400 mt-2">
            People you've connected with on DevTinder
          </p>
        </div>

        {/* Connections */}
        {connections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="text-6xl mb-5">🤝</div>

            <h2 className="text-2xl font-semibold text-white">
              No connections yet
            </h2>

            <p className="text-gray-400 mt-2">
              Start connecting with developers to see them here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {connections.map((connection) => (
              <div
                key={connection._id}
                className="bg-[#151a21] border border-gray-700/60 rounded-2xl p-6 hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Profile */}
                <div className="flex items-center gap-4">
                  <img
                    src={connection.photoUrl || null}
                    alt={`${connection.firstName} ${connection.lastName}`}
                    className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500/50"
                  />

                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {connection.firstName} {connection.lastName}
                    </h2>

                    <p className="text-gray-400 mt-1">
                      {connection.age} years old
                    </p>

                    <span className="badge badge-primary badge-sm mt-2">
                      {connection.gender}
                    </span>
                  </div>
                </div>

                {/* About */}
                <div className="mt-5">
                  <p className="text-gray-400 text-sm leading-6 line-clamp-3">
                    {connection.about || "No bio available."}
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => navigate(`/profile/${connection._id}`)}
                    className="btn btn-primary btn-sm flex-1"
                  >
                    View Profile
                  </button>

                  <button
                    onClick={() => navigate(`/chat/${connection._id}`)}
                    className="btn btn-outline btn-sm flex-1"
                  >
                    Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Connections;
