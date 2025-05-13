// frontend/src/components/OpenModalButton/OpenModalButton.jsx
import { useModal } from '../../context/Modal';

function OpenModalButton({
  modalComponent,
  buttonText,
  onButtonClick,
  onModalClose
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (typeof onButtonClick === "function") onButtonClick();
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
  };
  return <button onClick={onClick}>{buttonText}</button>;
}

export default OpenModalButton;