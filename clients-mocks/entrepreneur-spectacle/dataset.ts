export default {
  match: 'https://data.culture.gouv.fr/api/datasets/1.0/',
  response: {
    nhits: 1,
    parameters: {
      q: 'declarations-des-entrepreneurs-de-spectacles-vivants',
      rows: 10,
      start: 0,
      staged: false,
      include_draft: false,
      format: 'json',
      timezone: 'UTC',
    },
    datasets: [
      {
        datasetid: 'declarations-des-entrepreneurs-de-spectacles-vivants',
        metas: {
          domain: 'culture',
          staged: false,
          visibility: 'domain',
          metadata_processed: '2023-04-06T04:37:58.690047+00:00',
          data_processed: '2023-04-06T04:37:58+00:00',
          modified: '2023-04-06T04:37:58+00:00',
          license: 'Licence Ouverte v2.0 (Etalab)',
          publisher: 'Ministère de la Culture',
          description:
            "<p></p><p><i><b>Avertissement pour les entrepreneurs de spectacles</b></i></p><p>Vous pouvez vérifier le statut de votre déclaration dans l’onglet « tableau » de cette base de données mise à jour quotidiennement. <br/><b>Une déclaration au statut valide vaut licence d’entrepreneur de spectacles vivants pour cinq ans (sauf retrait de licence en cas d’illégalité). Aucun document ne vous sera envoyé pour indiquer que votre déclaration est valide ; la DRAC ne vous enverra pas de justificatif, le code du travail ayant institué une attribution tacite de licence.</b></p><b>Le numéro de licence est le numéro de déclaration. La catégorie de licence n’apparaît pas dans ce numéro mais dans le tableau.</b><br/><br/>Si la Direction générale des affaires cultures (DRAC) n'est pas revenue vers vous dans les 30 jours suivant votre déclaration, celle-ci apparaîtra sous le statut \"valide\" dans le tableau de la base de données.<br/>Si la DRAC vous a demandé des documents complémentaires, la licence est valide 30 jours après que le dossier ait été reçu complet et conforme à la réglementation. <br/>Si une déclaration que vous avez faite n’apparaît pas sur le tableau après plus d’un mois, veuillez contacter le <i>service technique des <a href=\"https://mesdemarches.culture.gouv.fr/\" target=\"_blank\">démarches en lignes</a></i>, il s’agit d’une erreur technique.<p></p><p><b>Pour toute question sur le contenu de votre déclaration (autre que le statut de la déclaration)</b>, il convient de contacter la DRAC de l'établissement principal de votre entreprise de spectacles <i>par courriel</i>.</p><p>Pour la définition des statuts (valide, invalide, invalidé, en instruction), voir ci-dessous le paragraphe concernant la définition des statuts. </p><p>La base de données comprend les déclarations d'activité d'entrepreneur de spectacles vivants déposées auprès des préfets de région depuis le 23 avril 2020, et le statut de ces déclarations (en instruction, valide, invalide, invalidé). <br/>Pour tout savoir sur la réglementation relative à ces licences, consulter la <a href=\"https://www.culture.gouv.fr/Sites-thematiques/Theatre-spectacles/Pour-les-professionnels/Plateforme-des-entrepreneurs-de-spectacles-vivants-PLATESV\" target=\"_blank\">plateforme des entrepreneurs de spectacles vivants</a>, et notamment ses fiches techniques. </p><p>Pour chaque déclaration, le tableau comporte les données suivantes :<br/>- numéro de déclaration (la lettre indiquant le type de déclaration : première demande de licence (D) ou renouvellement (R) ) ;<br/>- catégorie de licence concernée par la déclaration (pour les définitions juridiques et pratiques des catégories de licences, <a href=\"https://www.culture.gouv.fr/Thematiques/Theatre-spectacles/Pour-les-professionnels/Plateforme-des-entrepreneurs-de-spectacles-vivants-PLATESV#fiches\" target=\"_blank\">voir fiches 2.1, 2.2., 2.3</a>) ; <br/>- date de dépôt de déclaration ;<br/>- le cas échéant, date de validité de la déclaration (au cas général, date de dépôt + 30 jours ; au cas particulier, date de dépôt + une période supérieure à 30 jours si des compléments de dossiers ont été nécessaires) ;<br/>- raison sociale de l'organisme (personne morale) ou nom et prénom de l'entrepreneur de spectacles personne physique (en cas d'entreprise individuelle notamment) ;<br/>- code postal de l'établissement principal de l'organisme, ou de l'entrepreneur de spectacles personne physique ;<br/>- numéro de siret de l'organisme ou numéro de siren de l'entrepreneur de spectacles personne physique ;<br/>- code d'activité principale de l'entreprise, selon la nomenclature des activités françaises (APE-NAF) ;<br/>- pour les licences de catégorie 1 (exploitation de lieu de spectacles), nom du lieu de spectacles ;<br/>- pour les licences de catégorie 1, code postal du lieu de spectacles ;<br/>- type de déclaration (première demande; renouvellement) ;<br/>- géolocalisation : effectuée à partir du code postal de l'établissement principal de l'organisme, ou de l'adresse l'entrepreneur de spectacles personne physique.<br/><br/>DEFINITION DES STATUTS :<br/>- <b>valide</b> : La déclaration vaut licence ; l'exercice de la profession est licite ;<br/>Le tableau donne la date de dépôt de la déclaration et sa date de validité ;<br/>- <b>invalide</b> : la licence a été refusée ; l'exercice de la profession au titre de cette déclaration est interdit ;<br/>Ce peut être pour des raisons de forme (dossier incomplet, doublon, erreur de manipulation dans l'envoi du dossier, etc), ou de fond (dettes sociales, non respect du droit de travail ou de la propriété littéraire et artistique, absence de personne dans l'entreprise justifiant des compétences requises, dossier incomplet, etc);<br/>- <b>invalidé</b> : la licence a été retirée après une période de validité. La date d'invalidation est précisée. L'exercice de la profession au titre de cette déclaration est désormais interdit. L’invalidation peut être due à une cessation d’activité ou un exercice de la profession qui n’a pas respecté le droit du travail, le droit social, la sécurité, la propriété intellectuelle. <br/>- <b>en instruction</b> : état d'une déclaration pendant le délai d'instruction du dossier. L'exercice de la profession au titre de cette déclaration est interdit.<br/><br/><b>Ce délai est, de manière incompressible, de 30 jours après réception d’un dossier complet et conforme à la réglementation.</b><br/>Si un dossier est non conforme, et que le délai de mise en conformité donné par la DRAC à l’entrepreneur est dépassé, la déclaration devient invalide à expiration de ce délai. <br/>Si la mise en conformité est faite avant l’expiration du délai, le dossier devient valide 30 jours après la mise en conformité.<br/>Pour plus d'information sur les statuts et procédures : <a href=\"https://www.culture.gouv.fr/Sites-thematiques/Theatre-spectacles/Pour-les-professionnels/Plateforme-des-entrepreneurs-de-spectacles-vivants-PLATESV/Fiche-5.-Comment-obtenir-le-recepisse-valant-licence-qui-permettra-d-exercer-L-administration-peut-elle-s-y-opposer\" target=\"_blank\">consulter les points 5.3 et 5.4 de la fiche d'instruction numéro 5</a>.</p><p></p><p></p>",
          theme: ['Spectacle vivant'],
          keyword: [
            'licences',
            'entrepreneur de spectacles',
            'spectacle',
            'producteur',
            'diffuseur',
            'exploitant de lieu',
            'récépissé de licence',
            'statut de licence',
            'organisme culturel',
          ],
          title: 'Déclarations des entrepreneurs de spectacles vivants',
          license_url:
            'https://www.etalab.gouv.fr/wp-content/uploads/2017/04/ETALAB-Licence-Ouverte-v2.0.pdf',
          federated: false,
          modified_updates_on_metadata_change: false,
          geographic_reference_auto: true,
          modified_updates_on_data_change: true,
          timezone: 'Europe/Paris',
          metadata_languages: ['fr'],
          geographic_reference: ['world_fr'],
          language: 'fr',
          geometry_types: ['Point'],
          attributions: [
            'INSEE IGN NaturalEarth',
            'INSEE IGN NaturalEarth DGGL',
          ],
          territory: ['France'],
          records_count: 61811,
          responsable: "DGCA / bureau de l'emploi du spectacle vivant",
        },
        has_records: true,
        data_visible: true,
        features: ['analyze', 'calendar', 'timeserie', 'geo'],
        attachments: [],
        alternative_exports: [],
        fields: [
          {
            name: 'numero_de_recepisse',
            label: 'Numéro de récépissé',
            type: 'text',
          },
          {
            name: 'date_de_depot_de_la_declaration_inscrite_sur_le_recepisse',
            annotations: [
              { name: 'facet' },
              { name: 'timerangeFilter' },
              { args: ['-alphanum'], name: 'facetsort' },
            ],
            label:
              'Date de dépôt de la déclaration (inscrite sur le récépissé)',
            type: 'date',
          },
          {
            name: 'statut_du_recepisse',
            annotations: [{ name: 'facet' }],
            label: 'Statut du récépissé',
            type: 'text',
          },
          {
            name: 'categorie',
            annotations: [{ name: 'facet' }],
            label: 'Catégorie',
            type: 'int',
          },
          {
            name: 'type',
            annotations: [{ name: 'facet' }],
            label: 'Type de déclaration',
            type: 'text',
          },
          {
            name: 'date_de_validite_du_recepisse_sauf_opposition_de_l_administration',
            label:
              "Date de validité du récépissé (sauf opposition de l'administration)",
            type: 'text',
          },
          {
            name: 'type_de_declarant',
            annotations: [{ name: 'facet' }],
            label: 'Type de déclarant',
            type: 'text',
          },
          {
            name: 'raison_sociale_personne_morale_ou_nom_personne_physique',
            label:
              'Raison sociale (personne morale) ou nom (personne physique)',
            type: 'text',
          },
          {
            name: 'code_postal_de_l_etablissement_principal_personne_morale_ou_de_la_personne_physique',
            annotations: [
              { args: ['-count'], name: 'facetsort' },
              { name: 'sortable' },
            ],
            label:
              "Code postal de l'établissement principal (personne morale) ou de la personne physique",
            type: 'text',
          },
          {
            name: 'siren_personne_physique_siret_personne_morale',
            annotations: [{ args: ['-count'], name: 'facetsort' }],
            label: 'SIREN (personne physique) / SIRET (personne morale)',
            type: 'text',
          },
          { name: 'code_naf_ape', label: 'CODE NAF/APE', type: 'text' },
          { name: 'nom_du_lieu', label: 'Nom du lieu', type: 'text' },
          {
            name: 'code_postal_du_lieu',
            label: 'Code postal du lieu',
            type: 'text',
          },
          {
            name: 'geoloc_cp',
            description: 'géolocalisation calculée à partir du code postal',
            label: 'geoloc_cp',
            type: 'geo_point_2d',
          },
          {
            name: 'region',
            annotations: [
              { name: 'facet' },
              { args: ['alphanum'], name: 'facetsort' },
              { name: 'disjunctive' },
            ],
            label: 'Région',
            type: 'text',
          },
          {
            name: 'departement',
            annotations: [
              { name: 'facet' },
              { args: ['alphanum'], name: 'facetsort' },
              { name: 'disjunctive' },
            ],
            label: 'Département',
            type: 'text',
          },
        ],
      },
    ],
  },
};
