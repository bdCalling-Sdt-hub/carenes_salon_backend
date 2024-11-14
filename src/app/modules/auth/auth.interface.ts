export type TLoginUser = {
  email: string;
  password: string;
};

export interface ILoginWithGoogle {
  name: string;
  email: string;
  profile_image?: string;
  inviteToken?:string;
  username?:string;
  phone?:string
}