import React from "react";
import { Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

const RoleSelection: React.FC = () => {
  const navigate = useNavigate();

  const handleRoleSelect = async (role: "employer" | "jobseeker") => {
    const user = auth.currentUser;

    if (!user) {
      message.error("Foydalanuvchi topilmadi. Avval tizimga kiring.");
      navigate("/signin");
      return;
    }

    try {
      // Foydalanuvchi hujjatini yangilash
      await updateDoc(doc(db, "users", user.uid), { role });

      message.success("Rol muvaffaqiyatli tanlandi!");

      // Role ga qarab sahifaga yo‘naltirish
      if (role === "employer") {
        navigate("/employer-home");
      } else {
        navigate("/jobseeker-home");
      }
    } catch (error: any) {
      console.error("Rolni yangilashda xatolik:", error);
      message.error("Rolni tanlashda xatolik yuz berdi. Qayta urinib ko‘ring.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6">Rolingizni tanlang</h2>
        <div className="flex flex-col gap-4">
          <Button
            type="primary"
            size="large"
            onClick={() => handleRoleSelect("employer")}
          >
            Ish joylovchi
          </Button>
          <Button
            type="default"
            size="large"
            onClick={() => handleRoleSelect("jobseeker")}
          >
            Ish qidiruvchi
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
