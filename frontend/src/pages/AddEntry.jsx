import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setEntry } from "../../redux/entrySlice";
import { toast } from "sonner";
import { X } from "lucide-react";

const incomeCategories = ["Income", "Borrow", "Loan"];
const expenseCategories = [
  "Food",
  "Housing",
  "Education",
  "Medical",
  "Travel",
  "Others",
];

const AddEntry = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { entries } = useSelector((state) => state.entry);
  const [entryData, setEntryData] = useState({
    type: "",
    category: "",
    paymentMethod: "",
    date: "",
    amount: "",
    description: "",
  });

  const handleChange = (key, value) => {
    setEntryData((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "type" && { category: "" }), // reset category if type changes
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:4000/api/entry/create",
        entryData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setEntry([...entries, res.data.entryData]));
        navigate("/");
        toast.success(res.data.message);
        setEntryData({
          type: "",
          category: "",
          paymentMethod: "",
          date: "",
          amount: "",
          description: "",
        });
        onClose();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const availableCategories =
    entryData.type === "income"
      ? incomeCategories
      : entryData.type === "expense"
      ? expenseCategories
      : [];

  return (
    <form
      onSubmit={handleSubmit}
      className="w-xl mx-auto p-6 space-y-4 border rounded-2xl shadow-md mt-6 bg-white"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-blue-800">Add New Entry</h2>
        <X className="text-red-600 cursor-pointer" onClick={onClose} />
      </div>

      <div className="w-full">
        <Label className="mb-2">Type</Label>
        <Select
          className=""
          onValueChange={(val) => handleChange("type", val)}
          value={entryData.type}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-2">Category</Label>
        <Select
          onValueChange={(val) => handleChange("category", val)}
          value={entryData.category}
          disabled={!entryData.type}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {availableCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-2">Payment Method</Label>
        <Select
          onValueChange={(val) => handleChange("paymentMethod", val)}
          value={entryData.paymentMethod}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-2">Date</Label>
        <Input
          type="date"
          value={entryData.date}
          onChange={(e) => handleChange("date", e.target.value)}
          required
        />
      </div>

      <div>
        <Label className="mb-2">Amount</Label>
        <Input
          type="number"
          value={entryData.amount}
          onChange={(e) => handleChange("amount", e.target.value)}
          required
        />
      </div>

      <div>
        <Label className="mb-2">Description</Label>
        <Textarea
          placeholder="Add a note (optional)"
          value={entryData.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-800 hover:bg-blue-900 text-white cursor-pointer"
      >
        Add Entry
      </Button>
    </form>
  );
};

export default AddEntry;
