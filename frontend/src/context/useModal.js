// frontend/src/context/useModal.js
import { useContext } from 'react';
import { ModalContext } from './Modal';

export const useModal = () => useContext(ModalContext);