

declare global {

  namespace Express {

    interface Request {
      userTokenData: {
        id: string,
        role: string
      };
    }
  }

}

// etse export vacio convierte el archivo en un modulo
export {}