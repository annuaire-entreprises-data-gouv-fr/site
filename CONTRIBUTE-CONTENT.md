# Tutoriel : Comment contribuer aux pages de contenus ?

Pour rappel, github agit comme une sorte de bibliothèque du code. Dans cette bibliothèque se trouve le [livre de l'Annuaire des Entreprises](https://github.com/etalab/annuaire-entreprises-site)

Le contenu est centralisé de manière très pratique dans le dossier [/data](https://github.com/etalab/annuaire-entreprises-site/tree/main/data)

## Modifier une page

- La retrouver
  - [retrouver une page d'administration](https://github.com/etalab/annuaire-entreprises-site/tree/main/data/administration)
  - [retrouver une page de FAQ](https://github.com/etalab/annuaire-entreprises-site/tree/main/data/faq)
  - [retrouver une landing page](https://github.com/etalab/annuaire-entreprises-site/tree/main/data/landing-page)
  - [ajouter un siren a la liste des siren protégés](https://github.com/etalab/annuaire-entreprises-site/tree/main/public/protected-siren.txt)
- Cliquer sur le bouton **edit** en haut à gauche
- Faire les modifications
- Enregistrer en cliquant sur **commit** en haut à gauche 
- Dans le message de commit : expliquer la modification (en français ou anglais)
- Cliquer sur propose changes en choississant de créer une pull request
- Expliquer la modification dans la fenêtre qui s’affiche
- Ajouter des reviewers qui vont relire et valider les changements : choisir @xavierJp et ajouter en plus toute personne pertiente (attention elle doit avoir un compte github)
- La validation d'une seule personne suffit !
- Vous pouvez a tout moment consulter le code modifié dans "Files changed" et ajouter des commentaires

## Et pour créer un nouveau fichier ? 

[Créer une page d'administration](https://github.com/etalab/annuaire-entreprises-site/new/main/data/administrations?filename=nouvelle-administration.md&value=test)

[Créer une page de FAQ](https://github.com/etalab/annuaire-entreprises-site/new/main/data/faq?filename=nouvelle-faq.md&value=test)

[Créer une landing page](https://github.com/etalab/annuaire-entreprises-site/new/main/data/landing-pages?filename=nouvelle-landing-page.md&value=test)  

## Faire une review

- Cliquer sur le lien recu par email
- Ouvrir l'onglet **Files changed**
- Comparer entre l'ancienne version (ligne rouge) et la nouvelle version (ligne verte)
- La petite roue crantée permet de voire les deux versions cote a cote
- Un changement, un commentaire ? Passer la souris sur une ligne et cliquer sur le petit **+** bleu pour faire un commentaire, puis "Start a review"
- Tout est bon, plus de commentaire ? 3 options : **comment**, **approuve**, **request change**

## Petits rappels et astuces et de mise en page

L’indentation est très importante / les ordres donnés tout à gauche 

Le markdown est un langage de formatage de texte simplifié très pratique : 

```
# titre de niveau 1 

## titre de niveau 2 

### titre de niveau 3 

**gras**

*italique*

~~barré~~
```

En savoir plus sur [les règles markdown.](https://docs.github.com/fr/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)

NB : ca marche aussi sur whatsapp, notion et plein d'autres !
