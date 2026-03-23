import jwt from "jsonwebtoken";

// Member //
export const createMemberToken = (member) => {
  const payload = {
    id: member.memberId,
    role: "MEMBER",
  };
  return jwt.sign(payload, process.env.MEMBER_SECRET, {
    algorithm: "HS256",
    expiresIn: "1d",
  });
};

export const verifyMemberToken = (token) => {
  try {
    return jwt.verify(token, process.env.MEMBER_SECRET);
  } catch (error) {
    return null;
  }
};

// Admin //
export const createAdminToken = (admin) => {
  const payload = {
    id: admin.adminId,
    role: admin.role,
  };
  return jwt.sign(payload, process.env.ADMIN_SECRET, {
    algorithm: "HS256",
    expiresIn: "1d",
  });
};

export const verifyAdminToken = (token) => {
  try {
    return jwt.verify(token, process.env.ADMIN_SECRET);
  } catch (error) {
    return null;
  }
};
