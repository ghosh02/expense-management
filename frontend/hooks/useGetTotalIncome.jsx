import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setTotalIncome } from "../redux/entrySlice";

const useGetTotalIncome = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/entry/income", {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setTotalIncome(res.data.totalIncome));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchIncome();
  }, [dispatch]);
};

export default useGetTotalIncome;
