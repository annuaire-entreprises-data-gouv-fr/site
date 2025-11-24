import clsx from "clsx";
import { useCallback, useId, useRef, useState } from "react";
import { Icon } from "#components-ui/icon/wrapper";
import constants from "#models/constants";
import styles from "./styles.module.css";

interface FileInputProps {
  onChange: (fileContent: string) => void;
  onError: (error: string) => void;
  description: string;
}

export function FileInput(props: FileInputProps) {
  const { onChange, onError, description } = props;

  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const processFile = useCallback(
    (file: File) => {
      if (file.type !== "text/plain" && !file.name.endsWith(".txt")) {
        onError("Veuillez sélectionner un fichier .txt");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        onChange(e.target?.result as string);

        if (inputRef.current) {
          inputRef.current.value = "";
        }
      };
      reader.readAsText(file);
    },
    [onChange, onError]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processFile(e.dataTransfer.files[0]);
      }
    },
    [processFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        processFile(e.target.files[0]);
      }
    },
    [processFile]
  );

  return (
    <div
      className={clsx(styles.fileUploadArea, "fr-mt-2v", {
        [styles.dragActive]: dragActive,
      })}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        accept=".txt"
        className={styles.fileInput}
        id={inputId}
        onChange={handleFileInput}
        ref={inputRef}
        type="file"
      />
      <label className={styles.fileUploadLabel} htmlFor={inputId}>
        <Icon color={constants.colors.frBlue} slug="download" />
        <span>
          Glissez-déposez votre fichier ou cliquez pour le sélectionner
        </span>
        <div className={styles.fileUploadLabelDescription}>
          <small>Fichier au format .txt</small>
          <small>{description}</small>
        </div>
      </label>
    </div>
  );
}
