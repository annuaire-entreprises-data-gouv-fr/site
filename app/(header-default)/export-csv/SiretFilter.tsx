'use client';

import { Icon } from '#components-ui/icon/wrapper';
import constants from '#models/constants';
import { useRef, useState } from 'react';
import styles from './styles.module.css';

interface SiretFilterProps {
  siretsAndSirens: string[];
  onSiretsAndSirensChange: (siretList: string[]) => void;
}

export const SiretFilter: React.FC<SiretFilterProps> = ({
  siretsAndSirens,
  onSiretsAndSirensChange,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateSiretOrSiren = (value: string): boolean => {
    const trimmed = value.trim();
    return /^\d{9}$/.test(trimmed) || /^\d{14}$/.test(trimmed);
  };

  const processFile = (file: File) => {
    setError(null);

    if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
      setError('Veuillez sélectionner un fichier .txt');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const lines = content
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line.length > 0);

        const invalidValues = lines.filter(
          (line) => !validateSiretOrSiren(line)
        );

        if (invalidValues.length > 0) {
          setError(
            `${invalidValues.length} valeur(s) invalide(s) détectée(s). Un SIREN doit contenir exactement 9 chiffres, un SIRET doit contenir exactement 14 chiffres.`
          );
          return;
        }

        const validValues = lines.filter((line) => validateSiretOrSiren(line));
        onSiretsAndSirensChange(validValues);

        if (validValues.length === 0) {
          setError('Aucun SIREN ou SIRET valide trouvé dans le fichier');
        }
      } catch (err) {
        setError('Erreur lors de la lecture du fichier');
      }
    };

    reader.readAsText(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const clearSiretList = () => {
    onSiretsAndSirensChange([]);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <section className={styles.formSection}>
      <h2>
        Charger une liste de SIREN/SIRET{' '}
        <Icon color={constants.colors.frBlue} slug="file" />
      </h2>

      <div className={styles.siretContainer}>
        <div
          className={`${styles.fileUploadArea} ${
            dragActive ? styles.dragActive : ''
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt"
            onChange={handleFileInput}
            className={styles.fileInput}
            id="siret-file-input"
          />
          <label htmlFor="siret-file-input" className={styles.fileUploadLabel}>
            <Icon color={constants.colors.frBlue} slug="download" />
            <span>
              Glissez-déposez votre fichier .txt ici ou cliquez pour le
              sélectionner
            </span>
            <small>
              Le fichier doit contenir un SIREN ou SIRET par ligne (9 ou 14
              chiffres)
            </small>
          </label>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        {siretsAndSirens.length > 0 && (
          <div className={styles.siretListContainer}>
            <div className={styles.siretListHeader}>
              <h3 className={styles.subsectionTitle}>
                Sélection actuelle ({siretsAndSirens.length})
              </h3>
              <button
                type="button"
                className="fr-btn fr-btn--sm fr-btn--secondary"
                onClick={clearSiretList}
              >
                Effacer la liste
              </button>
            </div>

            <div className={styles.siretList}>
              {siretsAndSirens.slice(0, 10).map((siret, index) => (
                <span key={index} className="fr-tag">
                  {siret}
                </span>
              ))}
              {siretsAndSirens.length > 10 && (
                <span className="fr-tag">
                  +{siretsAndSirens.length - 10} autres...
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SiretFilter;
