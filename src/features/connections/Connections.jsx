import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "./connectionSlice";
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
      <div className="flex min-h-[calc(100vh-74px)] items-center justify-center bg-dt-background">
        <span className="loading loading-spinner loading-lg text-dt-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-74px)] bg-dt-background px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dt-text">Your Connections</h1>

          <p className="mt-2 text-dt-muted">
            People you've connected with on Devora
          </p>
        </div>

        {/* Connections */}

        {connections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="mb-5 text-6xl">🤝</div>

            <h2 className="text-2xl font-semibold text-dt-text">
              No connections yet
            </h2>

            <p className="mt-2 text-dt-muted">
              Start connecting with developers to see them here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {connections?.map((connection) => {
              if (!connection) return;

              return (
                <div
                  key={connection._id}
                  className="
                    rounded-2xl
                    border border-dt-border
                    bg-dt-surface
                    p-6
                    transition-all duration-300
                    hover:-translate-y-1
                    hover:border-dt-primary/50
                    hover:shadow-lg
                  "
                >
                  {/* Profile */}

                  <div className="flex items-center gap-4">
                    <img
                      src={connection?.photoUrl || "/profileholder.png"}
                      alt={`${connection?.firstName} ${connection?.lastName}`}
                      className="
                        h-20 w-20
                        rounded-full
                        border-2 border-dt-primary/50
                        object-cover
                      "
                    />

                    <div className="min-w-0">
                      <h2 className="text-xl font-bold text-dt-text">
                        {connection?.firstName} {connection?.lastName}
                      </h2>

                      <p className="mt-1 text-dt-muted">
                        {connection?.age} years old
                      </p>

                      <span className="badge badge-primary badge-sm mt-2">
                        {connection?.gender}
                      </span>
                    </div>
                  </div>

                  {/* Buttons */}

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => navigate(`/profile/${connection?._id}`)}
                      className="
                        btn btn-sm
                        flex-1
                        border-none
                        bg-dt-primary
                        text-white
                        hover:bg-dt-primary-hover
                      "
                    >
                      View Profile
                    </button>

                    <button
                      onClick={() => navigate(`/chat/${connection?._id}`)}
                      className="
                        btn btn-sm
                        flex-1
                        border-dt-border
                        bg-transparent
                        text-dt-text
                        hover:border-dt-primary
                        hover:bg-dt-primary/10
                        hover:text-dt-primary
                      "
                    >
                      Message
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Connections;
