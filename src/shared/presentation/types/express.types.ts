declare global {
  namespace Express {
    interface Request {
      userTokenData?: {
        id: string;
        role: string;
      };
    }
  }
}

export {};
