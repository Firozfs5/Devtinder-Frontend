import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeUserRequests } from "../utils/requestSlice";
import { useEffect } from "react";
import { reduceReqCount } from "../utils/userSlice";

function Requests() {
  const dispatch = useDispatch();

  const requests = useSelector((store) => store.requests);

  const getRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/recieved", {
        withCredentials: true,
      });
      dispatch(addRequests(res.data.users));
    } catch (err) {
      console.log(err);
    }
  };

  const handleReview = async (status, requestId) => {
    try {
      await axios.post(
        BASE_URL + `/requests/review/${status}/${requestId}`,
        {},
        { withCredentials: true },
      );
      dispatch(removeUserRequests(requestId));
      dispatch(reduceReqCount());
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getRequests();
  }, []);

  if (!requests) {
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
          <h1 className="text-3xl font-bold text-white">Connection Requests</h1>

          <p className="text-gray-400 mt-2">
            Developers who want to connect with you
          </p>
        </div>

        {/* No requests */}
        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="text-6xl mb-5">📭</div>

            <h2 className="text-2xl font-semibold text-white">
              No requests yet
            </h2>

            <p className="text-gray-400 mt-2">
              When someone sends you a connection request, it will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((request) => (
              <div
                key={request._id}
                className="bg-[#151a21] border border-gray-700/60 rounded-2xl p-6 hover:border-indigo-500/50 transition-all duration-300"
              >
                {/* User info */}
                <div className="flex items-center gap-4">
                  <img
                    src={request.photoUrl}
                    alt={`${request.firstName} ${request.lastName}`}
                    className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500/50"
                  />

                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {request.firstName} {request.lastName}
                    </h2>

                    <p className="text-gray-400 mt-1">
                      {request.age} years old
                    </p>

                    <span className="badge badge-primary badge-sm mt-2">
                      {request.gender}
                    </span>
                  </div>
                </div>

                {/* About */}

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => handleReview("accepted", request.requestId)}
                    className="btn btn-primary btn-sm flex-1"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => handleReview("rejected", request.requestId)}
                    className="btn btn-outline btn-sm flex-1"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Requests;
