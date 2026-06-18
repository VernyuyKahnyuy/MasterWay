export const getAccessToken = () => {
    return localStorage.getItem("access");
};

export const getRefreshToken = () => {
    return localStorage.getItem("refresh");
};

export const getCurrentUserId = () => {
    const token = localStorage.getItem("access");
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
        return payload.user_id ?? null;
    } catch {
        return null;
    }
};

export const getCurrentUsername = () => {
    return localStorage.getItem("username") ?? null;
};

export const getIsAdmin = () => {
    return localStorage.getItem("is_staff") === "true";
};

export const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    localStorage.removeItem("is_staff");
    alert("Logged out successfully");
};