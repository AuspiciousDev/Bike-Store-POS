import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get("/refresh", {
      withCredentials: true,
    });
    setAuth((prev) => {
      console.log("Auth Prev :", JSON.stringify(prev));
      console.log("Auth Access Token :", response.data.accessToken);
      return {
        ...prev,
        username: response.data.username,
        userType: response.data.userType,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        accessToken: response.data.accessToken,
      };
    });
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
