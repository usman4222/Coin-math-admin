import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";
import { useSnackbar } from "notistack";
import DefaultLayout from "../layout/DefaultLayout";
import Breadcrumb from "./Breadcrumbs/Breadcrumb";
import Spinner from "./Spinner";
import { db } from "../firebase";

const YoutubeLink = () => {
  const [link1, setLink1] = useState("");
  const [title1, setTitle1] = useState("");
  const [link2, setLink2] = useState("");
  const [title2, setTitle2] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [existingAdId, setExistingAdId] = useState(null);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "youtubeLink"));
        if (!querySnapshot.empty) {
          const adDoc = querySnapshot.docs[0];
          setLink1(adDoc.data().link1);
          setTitle1(adDoc.data().title1 || ""); 
          setLink2(adDoc.data().link2);
          setTitle2(adDoc.data().title2 || ""); 
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
        link1,
        title1,
        link2,
        title2,
      };

      if (existingAdId) {
        const adDocRef = doc(db, "youtubeLink", existingAdId);
        await updateDoc(adDocRef, adData);
        enqueueSnackbar("Youtube Link updated successfully!", { variant: "success" });
      } else {
        await addDoc(collection(db, "youtubeLink"), adData);
        enqueueSnackbar("Youtube Link added successfully!", { variant: "success" });
      }

      setLink1("");
      setTitle1("");
      setLink2("");
      setTitle2("");
      setLoading(false);
    } catch (error) {
      console.error("Error adding/updating ad:", error);
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Youtube Link" />
      <div className="flex justify-center items-center">
        <div className="flex flex-col">
          <div className="rounded-sm md:w-[500px] border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">Add Youtube Link</h3>
            </div>
            <form onSubmit={handleAddAd}>
              <div className="p-6.5">
                <div className="w-full pb-5">
                  <label className="mb-2.5 block text-black dark:text-white">Link 1</label>
                  <input
                    type="text"
                    onChange={(e) => setLink1(e.target.value)}
                    value={link1}
                    required
                    placeholder="Enter Link 1"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div className="w-full pb-5">
                  <label className="mb-2.5 block text-black dark:text-white">Title 1</label>
                  <input
                    type="text"
                    onChange={(e) => setTitle1(e.target.value)}
                    value={title1}
                    required
                    placeholder="Enter Title 1"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div className="w-full pb-5">
                  <label className="mb-2.5 block text-black dark:text-white">Link 2</label>
                  <input
                    type="text"
                    onChange={(e) => setLink2(e.target.value)}
                    value={link2}
                    required
                    placeholder="Enter Link 2"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div className="w-full pb-5">
                  <label className="mb-2.5 block text-black dark:text-white">Title 2</label>
                  <input
                    type="text"
                    onChange={(e) => setTitle2(e.target.value)}
                    value={title2}
                    required
                    placeholder="Enter Title 2"
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

export default YoutubeLink;
