import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../../utils/constants";
import { addUser } from "./userSlice";
import UserCard from "../feed/UserCard";

function EditProfile() {
  const user = useSelector((store) => store.user);
  const [toastShow, setToastShow] = useState(false);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    // photoUrl: user?.photoUrl || "",
    age: user?.age || "",
    gender: user?.gender || "",
    about: user?.about || "",
    skills: user?.skills || [],
  });

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
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

  const handlePhotoUpload = async () => {
    if (!selectedPhoto) return;

    try {
      setUploadingPhoto(true);

      const photoData = new FormData();

      photoData.append("profilePhoto", selectedPhoto);

      const res = await axios.post(BASE_URL + "/profile/photo", photoData, {
        withCredentials: true,
      });

      dispatch(
        addUser({
          ...user,
          photoUrl: res.data.imageUrl,
        }),
      );

      setSelectedPhoto(null);
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.patch(BASE_URL + "/profile/edit", formData, {
        withCredentials: true,
      });

      dispatch(addUser(res.data.updatedData));

      setToastShow(true);

      setTimeout(() => {
        setToastShow(false);
      }, 3000);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dt-background">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-dt-primary"></span>

          <p className="text-dt-muted">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dt-background px-4 py-10">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
        {/* =================================================
            EDIT FORM
        ================================================= */}

        <div className="rounded-2xl border border-dt-border bg-dt-surface p-6 shadow-xl">
          <h1 className="mb-2 text-2xl font-bold text-dt-text">Edit Profile</h1>

          <p className="mb-6 text-sm text-dt-muted">
            Update your profile and see the changes instantly.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* First Name */}

            <div>
              <label className="mb-2 block text-sm font-medium text-dt-text">
                First Name
              </label>

              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="
                  w-full
                  rounded-xl
                  border
                  border-dt-border
                  bg-dt-surface-2
                  px-4
                  py-3
                  text-dt-text
                  placeholder:text-dt-muted
                  outline-none
                  transition
                  focus:border-dt-primary
                  focus:ring-1
                  focus:ring-dt-primary
                "
              />
            </div>

            {/* Last Name */}

            <div>
              <label className="mb-2 block text-sm font-medium text-dt-text">
                Last Name
              </label>

              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="
                  w-full
                  rounded-xl
                  border
                  border-dt-border
                  bg-dt-surface-2
                  px-4
                  py-3
                  text-dt-text
                  outline-none
                  transition
                  focus:border-dt-primary
                  focus:ring-1
                  focus:ring-dt-primary
                "
              />
            </div>

            {/* Profile Photo */}

            <div>
              <label className="mb-2 block text-sm font-medium text-dt-text">
                Profile Photo
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];

                  setSelectedPhoto(file);

                  if (file) {
                    setPhotoPreview(URL.createObjectURL(file));
                  }
                }}
                className="
                  w-full
                  cursor-pointer
                  rounded-xl
                  border
                  border-dt-border
                  bg-dt-surface-2
                  px-4
                  py-3
                  text-sm
                  text-dt-text
                  file:mr-4
                  file:rounded-lg
                  file:border-0
                  file:bg-dt-primary
                  file:px-3
                  file:py-2
                  file:text-sm
                  file:font-medium
                  file:text-white
                  hover:file:bg-dt-primary-hover
                "
              />

              {selectedPhoto && (
                <>
                  <p className="mt-2 text-sm text-dt-muted">
                    Selected: {selectedPhoto.name}
                  </p>

                  <button
                    type="button"
                    onClick={handlePhotoUpload}
                    disabled={uploadingPhoto}
                    className="
                      mt-3
                      rounded-xl
                      bg-dt-primary
                      px-5
                      py-2
                      font-semibold
                      text-white
                      transition
                      hover:bg-dt-primary-hover
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    {uploadingPhoto ? "Uploading..." : "Upload Photo"}
                  </button>
                </>
              )}
            </div>

            {/* Age + Gender */}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-dt-text">
                  Age
                </label>

                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-dt-border
                    bg-dt-surface-2
                    px-4
                    py-3
                    text-dt-text
                    outline-none
                    transition
                    focus:border-dt-primary
                    focus:ring-1
                    focus:ring-dt-primary
                  "
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-dt-text">
                  Gender
                </label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-dt-border
                    bg-dt-surface-2
                    px-4
                    py-3
                    text-dt-text
                    outline-none
                    transition
                    focus:border-dt-primary
                    focus:ring-1
                    focus:ring-dt-primary
                  "
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
              <label className="mb-2 block text-sm font-medium text-dt-text">
                About
              </label>

              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                rows="4"
                className="
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-dt-border
                  bg-dt-surface-2
                  px-4
                  py-3
                  text-dt-text
                  outline-none
                  transition
                  focus:border-dt-primary
                  focus:ring-1
                  focus:ring-dt-primary
                "
              />
            </div>

            {/* Skills */}

            <div>
              <label className="mb-2 block text-sm font-medium text-dt-text">
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
                  className="
                    flex-1
                    rounded-xl
                    border
                    border-dt-border
                    bg-dt-surface-2
                    px-4
                    py-3
                    text-dt-text
                    placeholder:text-dt-muted
                    outline-none
                    transition
                    focus:border-dt-primary
                    focus:ring-1
                    focus:ring-dt-primary
                  "
                />

                <button
                  type="button"
                  onClick={addSkill}
                  className="
                    rounded-xl
                    bg-dt-primary
                    px-5
                    font-semibold
                    text-white
                    transition
                    hover:bg-dt-primary-hover
                  "
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
                    className="
                      rounded-full
                      border
                      border-dt-primary/20
                      bg-dt-primary/10
                      px-3
                      py-1
                      text-sm
                      text-dt-primary
                      transition
                      hover:border-red-500/20
                      hover:bg-red-500/10
                      hover:text-red-500
                    "
                  >
                    {skill} ×
                  </button>
                ))}
              </div>
            </div>

            {/* Save */}

            <button
              type="submit"
              className="
                w-full
                rounded-xl
                bg-dt-primary
                py-3
                font-semibold
                text-white
                shadow-lg
                shadow-dt-primary/20
                transition
                hover:bg-dt-primary-hover
                active:scale-[0.98]
              "
            >
              Save Changes
            </button>
          </form>
        </div>

        {/* =================================================
            LIVE PREVIEW
        ================================================= */}

        <div className="flex flex-col items-center">
          <h2 className="mb-4 text-lg font-semibold text-dt-text">
            Live Preview
          </h2>

          <UserCard
            user={{
              ...formData,
              photoUrl: photoPreview || user?.photoUrl,
            }}
          />
        </div>
      </div>

      {/* =================================================
          SUCCESS TOAST
      ================================================= */}

      {toastShow && (
        <div className="fixed left-1/2 top-5 z-9999 -translate-x-1/2">
          <div
            className="
              rounded-xl
              border
              border-green-500/20
              bg-green-500
              px-6
              py-3
              text-white
              shadow-2xl
            "
          >
            <span className="font-semibold">
              ✓ Profile Updated Successfully
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditProfile;
