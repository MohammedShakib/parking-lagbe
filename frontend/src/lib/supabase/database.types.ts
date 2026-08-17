export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      account_information: {
        Row: {
          username: string;
          auth_user_id: string | null;
          status: "verified" | "unverified";
          owner_id: string | null;
          default_dashboard: "business" | "user" | null;
          points: number;
          user_level: "bronze" | "gold" | "diamond";
        };
      };
    };
  };
};
