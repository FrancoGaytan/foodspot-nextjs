import FastAprovalForm from "@components/Modules/FastApprovalForm";


interface FastAprovalModalProps {
  eventId: string;
  userId: string;
  closeModal: () => void;
  refetchMembersAndReceiptInfo: () => void;
}

export default function FastAprovalModal(props: FastAprovalModalProps) {
  return (
    <div style={{ padding: 32, textAlign: 'center' }}>
      <FastAprovalForm
        eventId={props.eventId}
        userId={props.userId}
        closeModal={props.closeModal}
        refetchMembersAndReceiptInfo={props.refetchMembersAndReceiptInfo}
      />
    </div>
  );
}