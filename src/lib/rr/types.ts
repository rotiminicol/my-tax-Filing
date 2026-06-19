export type ReceiptStatus = "draft" | "generated";
export type LandlordType = "landlord" | "agent";

export interface Receipt {
  id: string;
  createdAt: string;
  status: ReceiptStatus;
  taxpayer: {
    fullName: string;
    taxId: string;
    propertyAddress: string;
    annualRentalAmount: number;
    allowanceClaimed: number;
  };
  landlord: {
    fullName: string;
    type: LandlordType;
    address: string;
    phone: string;
    email?: string;
    taxId?: string;
  };
  employer: {
    companyName: string;
    taxId: string;
    taxOffice: string;
    claimYear: string;
  };
  declaration: boolean;
  signatureData?: string;
  typedSignature?: string;
  sigMode?: "draw" | "type";
  certifiedDate?: string;
}
