export interface transferReceipt {
  amount: number;
  description: string;
  datetime: Date;
  eventId: string;
  hasPaid: boolean;
  image: string;
  paymentMethod: string;
  userId: string;
  isShoppingDesignee?: string;
  _id: string;
}

export interface ITransferReceiptRequest {
  amount: number;
  description: string;
  user: string;
  paymentMethod: string;
  file: unknown; //this was any
}

export interface ITransferReceiptImage {
  file: unknown; // this was any
}

export interface ITransferReceiptInfoResponse {
  userId: string;
  userLastName: string;
  userName: string;
  hasReceiptApproved: boolean | null;
  hasUploaded: boolean;
  specialDiet: [];
  transferReceipt: string | null;
}

export interface ITransferReceiptResponse {
  _id: string;
  amount: number;
  description: string;
  datetime: string;
  event: string;
  hasPaid: boolean;
  image: string;
  paymentMethod: string;
  user: string;
}

export interface IUploadFileResponse {
  imageId: string;
}

export interface IUserReceiverInfo {
  receiverAlias: string;
  receiverCbu: string;
  receiverId: string;
  receiverLastName: string;
  receiverName: string;
}

export interface PayCheckInfoResponse {
  userId: string;
  userName: string;
  amount: number;
  receiver: IUserReceiverInfo;
}
