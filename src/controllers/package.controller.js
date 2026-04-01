import {
  createPackage,
  getPackages,
  getPackagesByGameId,
  updatePackage,
  deletePackage,
} from "../services/package.service.js";

export const addPackage = async (req, res) => {
  try {
    const newPackage = await createPackage(req.body);
    res.status(201).json({
      message: "สร้างแพ็กเกจสำเร็จ",
      data: newPackage,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "ไม่สามารถสร้างแพ็กเกจได้: " + error.message });
  }
};

export const getAllPackages = async (req, res) => {
  try {
    const packages = await getPackages();

    res.status(200).json(packages || []);
  } catch (error) {
    console.error("Get All Packages Error:", error);
    res.status(500).json({
      message: "ดึงข้อมูลแพ็กเกจทั้งหมดล้มเหลว: " + error.message,
    });
  }
};

export const getGamePackages = async (req, res) => {
  try {
    const { gameId } = req.params;

    if (!gameId || isNaN(gameId)) {
      return res.status(400).json({ message: "Invalid Game ID" });
    }

    const packages = await getPackagesByGameId(gameId);

    res.status(200).json(packages || []);
  } catch (error) {
    res
      .status(500)
      .json({ message: "ดึงข้อมูลแพ็กเกจล้มเหลว: " + error.message });
  }
};

export const editPackage = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await updatePackage(id, req.body);
    res.status(200).json({ message: "อัปเดตแพ็กเกจสำเร็จ", data: updated });
  } catch (error) {
    res.status(500).json({ message: "อัปเดตล้มเหลว: " + error.message });
  }
};

export const removePackage = async (req, res) => {
  try {
    const { id } = req.params;
    await deletePackage(id);
    res.status(200).json({ message: "ลบแพ็กเกจเรียบร้อยแล้ว" });
  } catch (error) {
    res.status(500).json({ message: "ไม่สามารถลบได้: " + error.message });
  }
};
