import { axiosWithCreds } from "./axiosInstances";

export const loginWithGoogle = async (idToken) => {
  const { data } = await axiosWithCreds.post("/auth/google", { idToken });
  return data;
};


export function loginWithGithub() {
  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_GITHUB_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_GITHUB_REDIRECT_URI,
    scope: "read:user user:email"
  });

  window.location.href =
    `https://github.com/login/oauth/authorize?${params}`;

}
