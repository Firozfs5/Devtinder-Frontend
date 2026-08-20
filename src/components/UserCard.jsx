function UserCard({ user }) {
  const { firstName, lastName, photoUrl, gender, age, about, skills } = user;

  return (
    <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-700 bg-[#151a21] shadow-xl">
      {/* Profile Image */}
      <div className="relative h-96 w-full">
        <img
          src={photoUrl == "" ? "/profileholder.png" : photoUrl}
          alt={`${firstName} ${lastName}`}
          className="h-full w-full object-cover"
        />

        {/* Gradient at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-[#151a21] to-transparent" />

        {/* Name */}
        <div className="absolute bottom-5 left-5">
          <h2 className="text-2xl font-bold text-white">
            {firstName} {lastName}
            {age && (
              <span className="ml-2 font-normal text-gray-300">{age}</span>
            )}
          </h2>

          {gender && (
            <p className="mt-1 text-sm capitalize text-gray-400">{gender}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-5">
        {/* About */}
        {about && (
          <div className="mb-5">
            <h3 className="mb-2 text-sm font-semibold text-indigo-400">
              About
            </h3>

            <p className="text-sm leading-6 text-gray-300">{about}</p>
          </div>
        )}

        {/* Skills */}
        {skills?.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold text-indigo-400">
              Skills
            </h3>

            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button className="flex-1 rounded-xl border border-gray-600 py-2.5 text-sm font-semibold text-gray-300 transition hover:bg-gray-800">
            Ignore
          </button>

          <button className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 py-2.5 text-sm font-semibold text-white transition hover:opacity-90">
            Interested
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserCard;
