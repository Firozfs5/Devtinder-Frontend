import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import UserCard from "./UserCard";

function EditProfile() {
  const user = useSelector((store) => store.user);
  const [toastShow, setToastShow] = useState(false);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    photoUrl: user?.photoUrl || "",
    age: user?.age || "",
    gender: user?.gender || "",
    about: user?.about || "",
    skills: user?.skills || [],
  });

  const [skillInput, setSkillInput] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addSkill = () => {
    const skill = skillInput.trim();

    if (!skill) return;

    if (formData.skills.includes(skill)) {
      setSkillInput("");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, skill],
    }));

    setSkillInput("");
  };

  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.patch(BASE_URL + "/profile/edit", formData, {
        withCredentials: true,
      });

      dispatch(addUser(res.data.updatedData));
      setToastShow(true);
      setTimeout(() => setToastShow(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1c222b]">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-indigo-500"></span>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1c222b] px-4 py-10">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
        {/* EDIT FORM */}
        <div className="rounded-2xl border border-gray-700 bg-[#151a21] p-6 shadow-xl">
          <h1 className="mb-2 text-2xl font-bold text-white">Edit Profile</h1>

          <p className="mb-6 text-sm text-gray-400">
            Update your profile and see the changes instantly.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* First Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                First Name
              </label>

              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-700 bg-[#1c222b] px-4 py-3 text-white outline-none focus:border-indigo-500"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Last Name
              </label>

              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-700 bg-[#1c222b] px-4 py-3 text-white outline-none focus:border-indigo-500"
              />
            </div>

            {/* Photo URL */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Photo URL
              </label>

              <input
                type="text"
                name="photoUrl"
                value={formData.photoUrl}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full rounded-xl border border-gray-700 bg-[#1c222b] px-4 py-3 text-white outline-none focus:border-indigo-500"
              />
            </div>

            {/* Age + Gender */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Age
                </label>

                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-700 bg-[#1c222b] px-4 py-3 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Gender
                </label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-700 bg-[#1c222b] px-4 py-3 text-white outline-none focus:border-indigo-500"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* About */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                About
              </label>

              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                rows="4"
                className="w-full resize-none rounded-xl border border-gray-700 bg-[#1c222b] px-4 py-3 text-white outline-none focus:border-indigo-500"
              />
            </div>

            {/* Skills */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Skills
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="React, Node.js..."
                  className="flex-1 rounded-xl border border-gray-700 bg-[#1c222b] px-4 py-3 text-white outline-none focus:border-indigo-500"
                />

                <button
                  type="button"
                  onClick={addSkill}
                  className="rounded-xl bg-indigo-600 px-5 font-semibold text-white hover:bg-indigo-500"
                >
                  Add
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {formData.skills.map((skill) => (
                  <button
                    type="button"
                    key={skill}
                    onClick={() => removeSkill(skill)}
                    className="rounded-full bg-indigo-500/10 px-3 py-1 text-sm text-indigo-300 hover:bg-red-500/10 hover:text-red-400"
                  >
                    {skill} ×
                  </button>
                ))}
              </div>
            </div>

            {/* Save */}
            <button
              type="submit"
              className="w-full rounded-xl bg-linear-to-r from-indigo-500 to-purple-500 py-3 font-semibold text-white transition hover:opacity-90"
            >
              Save Changes
            </button>
          </form>
        </div>

        {/* LIVE PREVIEW */}
        <div className="flex flex-col items-center">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Live Preview
          </h2>

          <UserCard user={formData} />
        </div>
      </div>
      {/*toast code to show profile update */}
      {toastShow && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span className="bold text-md text-black">
              Profile Updated successfully.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditProfile;
