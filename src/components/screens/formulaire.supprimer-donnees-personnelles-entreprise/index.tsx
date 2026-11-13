import { useEffect, useState } from "react";
import ButtonLink from "#/components-ui/button";
import { Modal } from "#/components-ui/modal";
import { HidePersonalDataModalContent } from "./modal-content";

const MODAL_ID = "hide-personal-data-modal";
const OPEN_MODAL_BUTTON_ID = "hide-personal-data-open-modal";

export default function HidePersonalDataPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const closeModal = () => {
    setIsModalVisible(false);
    document.getElementById(OPEN_MODAL_BUTTON_ID)?.focus();
  };

  useEffect(() => {
    if (!isModalVisible) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsModalVisible(false);
        document.getElementById(OPEN_MODAL_BUTTON_ID)?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isModalVisible]);

  return (
    <>
      <p>
        En tant que dirigeant(e) d’entreprise, les données publiques de votre
        entreprise peuvent contenir des informations personnelles (nom et
        prénom) accessibles sur internet.
      </p>
      <p>
        Ces données sont publiques mais vous pouvez vous opposer à ce qu’un site
        internet les publie.
      </p>
      <p>
        Ainsi, pour faire disparaitre vos informations de dirigeant(e) du site
        L’Annuaire des Entreprises vous pouvez nous en faire la demande.
      </p>
      <div className="layout-left">
        <ButtonLink
          id={OPEN_MODAL_BUTTON_ID}
          onClick={() => setIsModalVisible(true)}
          type="button"
        >
          Je souhaite cacher mes informations de dirigeant(e)
        </ButtonLink>
      </div>
      <p>
        Si vous souhaitez exercer d’autres droits vous pouvez écrire à{" "}
        <a href="mailto:mesdonnees@modernisation.gouv.fr">
          mesdonnees@modernisation.gouv.fr
        </a>
        .
      </p>
      <Modal
        closeButtonLabel="Fermer la fenêtre de demande de suppression de données personnelles"
        isVisible={isModalVisible}
        modalId={MODAL_ID}
        onClose={closeModal}
        textAlign="left"
      >
        <HidePersonalDataModalContent />
      </Modal>
    </>
  );
}
