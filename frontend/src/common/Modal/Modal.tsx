import React, { FC, forwardRef, useContext } from "react";
import { TransitionProps } from "@material-ui/core/transitions/transition";
import { Slide, Dialog, DialogTitle, DialogContent } from "@material-ui/core";
import Context from "../../context/context";
const Transition = forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
interface ModalProps {
  title: string;
}
const ModalWindow: FC<ModalProps> = ({ title, children }) => {
  const { isModalOpen, closeModal } = useContext(Context);

  return (
    <Dialog
      open={isModalOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={closeModal}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};
export default ModalWindow;
