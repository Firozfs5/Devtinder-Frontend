import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeUserRequests } from "./requestSlice";
import { useEffect } from "react";
import { reduceReqCount } from "../profile/userSlice";

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
          <h1 className="text-3xl font-bold text-dt-text">
            Connection Requests
          </h1>

          <p className="mt-2 text-dt-muted">
            Developers who want to connect with you
          </p>
        </div>

        {/* No requests */}

        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="mb-5 text-6xl">📭</div>

            <h2 className="text-2xl font-semibold text-dt-text">
              No requests yet
            </h2>

            <p className="mt-2 text-center text-dt-muted">
              When someone sends you a connection request, it will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {requests.map((request) => (
              <div
                key={request._id}
                className="
                  rounded-2xl
                  border border-dt-border
                  bg-dt-surface
                  p-6
                  transition-all duration-300
                  hover:border-dt-primary/50
                  hover:-translate-y-1
                  hover:shadow-lg
                "
              >
                {/* User info */}

                <div className="flex items-center gap-4">
                  <img
                    src={request.photoUrl}
                    alt={`${request.firstName} ${request.lastName}`}
                    className="
                      h-20 w-20
                      rounded-full
                      border-2 border-dt-primary/50
                      object-cover
                    "
                  />

                  <div className="min-w-0">
                    <h2 className="text-xl font-bold text-dt-text">
                      {request.firstName} {request.lastName}
                    </h2>

                    <p className="mt-1 text-dt-muted">
                      {request.age} years old
                    </p>

                    <span className="badge badge-primary badge-sm mt-2">
                      {request.gender}
                    </span>
                  </div>
                </div>

                {/* About */}

                {/* Actions */}

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => handleReview("accepted", request.requestId)}
                    className="
                      btn btn-sm
                      flex-1
                      border-none
                      bg-dt-primary
                      text-white
                      hover:bg-dt-primary-hover
                    "
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => handleReview("rejected", request.requestId)}
                    className="
                      btn btn-sm
                      flex-1
                      border-dt-border
                      bg-transparent
                      text-dt-text
                      hover:border-red-500
                      hover:bg-red-500/10
                      hover:text-red-500
                    "
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
