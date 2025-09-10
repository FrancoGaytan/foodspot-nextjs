import ConfirmationPayForm from "@components/Modules/ConfirmationPayForm";
import { IEvent } from "@models/event";

interface ConfirmationPayModalProps {
  event: IEvent;
  transferReceiptId: string | undefined;
  userToApprove: string;
  closeModal: () => void;
  refetchEvent: () => void;
  user: any;
}

export default function ConfirmationPayModal(props: ConfirmationPayModalProps) {
  return (
 <div style={{ padding: 32, textAlign: 'center' }}>
      {props.user && (
        <ConfirmationPayForm
          event={props.event}
          transferReceiptId={props.transferReceiptId}
          userToApprove={props.userToApprove}
          closeModal={props.closeModal}
          refetchEvent={props.refetchEvent}
        />
      )}
    </div>
  );
}