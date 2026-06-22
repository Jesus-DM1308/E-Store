import {DrizzleAddressDataSource} from "../../infrastructure/index.js";
import {AddressRepositoryImpl} from "../../infrastructure/index.js";
import {CreateAddressService, UpdateAddressService, DeleteAddressService, GetAddressService} from "../../application/index.js";
import {AddressController} from "../index.js"


// datasource
const datasource = new DrizzleAddressDataSource();
// repository
const repository = new AddressRepositoryImpl(datasource);
// services
const createAddressService = new CreateAddressService(repository);

const updateAddressService =new UpdateAddressService(repository);

const deleteAddressService = new DeleteAddressService(repository);

const getAddressService = new GetAddressService(repository);
// controller
export const AddressController = new AddressController(
    createAddressService,
    updateAddressService,
    deleteAddressService,
    getAddressService,
    repository
  );