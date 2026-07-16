

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

// este export vacio convierte el archivo en un modulo
export {}
