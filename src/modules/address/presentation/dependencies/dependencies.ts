import { DrizzleAddressDataSource } from "../../infrastructure/index.js";
import { AddressRepositoryImpl } from "../../infrastructure/index.js";
import { CreateAddressService, UpdateAddressService, DeleteAddressService, GetAddressService } from "../../application/index.js";
import { AddressController } from "../controllers/address.controller.js" // NO CAMBIAR, PORQUE OCURRE UN ERROR


const datasource = new DrizzleAddressDataSource();
const repository = new AddressRepositoryImpl(datasource);
const createAddressService = new CreateAddressService(repository);

const updateAddressService =new UpdateAddressService(repository);
const deleteAddressService = new DeleteAddressService(repository);
const getAddressService = new GetAddressService(repository);

// controller
export const addressController = new AddressController(
    createAddressService,
    updateAddressService,
    deleteAddressService,
    getAddressService,
    repository
  );