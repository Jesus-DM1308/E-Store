export class OrderAddressEntity {
  constructor(
    public readonly street: string,
    public readonly colony: string,
    public readonly references: string,
    public readonly postalCode: string
  ) {}
}