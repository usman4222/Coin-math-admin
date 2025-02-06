import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";
import { useSnackbar } from "notistack";
import DefaultLayout from "../layout/DefaultLayout";
import Breadcrumb from "./Breadcrumbs/Breadcrumb";
import Spinner from "./Spinner";
import { db } from "../firebase";

const TaskLink = () => {
  const [taskLink, setTaskLink] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [existingAdId, setExistingAdId] = useState(null);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "dailyTaskLink"));
        if (!querySnapshot.empty) {
          const adDoc = querySnapshot.docs[0];
          setTaskLink(adDoc.data().taskLink);
          setExistingAdId(adDoc.id);
        }
      } catch (error) {
        console.error("Error fetching ad:", error);
      }
    };

    fetchAd();
  }, []);

  const handleAddAd = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const adData = {
        taskLink,
      };

      if (existingAdId) {
        const adDocRef = doc(db, "dailyTaskLink", existingAdId);
        await updateDoc(adDocRef, adData);
        enqueueSnackbar("Daily Task Link updated successfully!", { variant: "success" });
      } else {
        await addDoc(collection(db, "dailyTaskLink"), adData);
        enqueueSnackbar("Daily Task Link added successfully!", { variant: "success" });
      }
      setTaskLink("");
      setLoading(false);
    } catch (error) {
      console.error("Error adding/updating ad:", error);
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Daily Task Link" />
      <div className="flex justify-center items-center">
        <div className="flex flex-col">
          <div className="rounded-sm md:w-[500px] border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">Add Task Link</h3>
            </div>
            <form onSubmit={handleAddAd}>
              <div className="p-6.5">
                <div className="w-full pb-5">
                  <label className="mb-2.5 block text-black dark:text-white">Task Link</label>
                  <input
                    type="text"
                    onChange={(e) => setTaskLink(e.target.value)}
                    value={taskLink}
                    required
                    placeholder="Enter Daily Task Link"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                  disabled={loading}
                >
                  {loading ? <Spinner /> : existingAdId ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default TaskLink;
