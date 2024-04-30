# Tutoriel : Comment contribuer aux pages de contenus ?

Pour rappel, github agit comme une sorte de bibliothèque du code. Dans cette bibliothèque se trouve le [livre de l'Annuaire des Entreprises](https://github.com/etalab/annuaire-entreprises-site)

Le contenu est centralisé de manière très pratique dans le dossier [/data](https://github.com/annuaire-entreprises-data-gouv-fr/site/tree/main/data)

## Modifier une page

- La retrouver
  - [retrouver une page d'administration](https://github.com/annuaire-entreprises-data-gouv-fr/site/tree/main/data/administration)
  - [retrouver une page de FAQ](https://github.com/annuaire-entreprises-data-gouv-fr/site/tree/main/data/faq)
  - [retrouver une page de définition](https://github.com/annuaire-entreprises-data-gouv-fr/site/tree/main/data/definitions)
  - [retrouver une landing page](https://github.com/annuaire-entreprises-data-gouv-fr/site/tree/main/data/landing-page)
  - [ajouter un siren a la liste des siren protégés](https://github.com/annuaire-entreprises-data-gouv-fr/site/tree/main/public/protected-siren.txt)
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

[Créer une page d'administration](https://github.com/annuaire-entreprises-data-gouv-fr/site/new/main/data/administrations?filename=nouvelle-administration.md&value=slug%3A%20le%20nom%20du%20fichier%20sans%20le%20.yml%0Ashort%3A%20le%20sigle%20de%20l%27administration%20ex%20Insee%0Asite%3A%20le%20site%20officiel%0AlogoType%3A%20paysage%20%7C%20portrait%20selon%20le%20sens%20du%20logo%0Along%3A%20ex%20Institut%20national%20de%20la%20statistique%20et%20des%20%C3%A9tudes%20%C3%A9conomiques%20%28Insee%29%0Acontact%3A%20mail%20ou%20lien%0AapiMonitors%3A%20la%20liste%20des%20api%0A%20%20-%20apigouvLink%3A%20lien%20apigouv%20%28facultatif%29%0A%20%20%20%20apiSlug%3A%20un%20slug%20d%27api%20unique%0A%20%20%20%20apiName%3A%20le%20nom%0A%20%20%20%20id%3A%20l%27id%20du%20monitoring%0AdataSources%3A%20la%20liste%20des%20jdd%0A%20%20-%20label%3A%20nom%0A%20%20%20%20apiSlug%3A%20slug%20de%20l%27API%20qui%20donne%20acc%C3%A9s%20au%20jdd%20si%20il%20y%20en%20a%20une%0A%20%20%20%20datagouvLink%3A%20lien%20vers%20le%20jdd%20datagouv%20si%20il%20y%20en%20a%20un%0A%20%20%20%20keywords%3A%20liste%20des%20principales%20donn%C3%A9es%20a%20trouver%20dans%20le%20jdd%20s%C3%A9par%C3%A9es%20par%20une%20virgule%0Adescription%3A%20une%20description%20de%20l%27administration%2C%20sa%20mission%2C%20ses%20principales%20donn%C3%A9es)

[Créer une page de FAQ](https://github.com/annuaire-entreprises-data-gouv-fr/site/new/main/data/faq?filename=nouvelle-faq.md&value=administrations%3A%20la%20liste%20des%20administrations%20concern%C3%A9es%20%28pour%20connaitre%20la%20liste%20possible%20voir%20la%20liste%20des%20fichiers%20administrations%20dans%20https%3A%2F%2Fgithub.com%2Fetalab%2Fannuaire-entreprises-site%2Ftree%2Fmain%2Fdata%2Fadministration%29%0Atargets%3A%20la%20liste%20des%20cibles%20%C3%A0%20choisir%20parmi%20%3A%20agent%20%7C%20particulier%20%7C%20dirigeant%20%7C%20independant%0Atitle%3A%20titre%0Aseo%3A%20description%20et%20titre%20pour%20le%20SEO%0A%20%20description%3A%0A%20%20title%3A%20si%20pas%20de%20titre%20sp%C3%A9cifi%C3%A9%2C%20le%20titre%20principal%20sera%20utilis%C3%A9%0Abody%3A%20corps%20de%20texte%20%28markdown%29%0Acta%3A%0A%20%20label%3A%20libell%C3%A9%20du%20CTA%0A%20%20to%3A%20url%20%28externe%20%28https%3A%2F%2F%29%20ou%20interne%20en%20commencant%20par%20%2F%29%0Amore%3A%0A%20%20-%20label%3A%20libell%C3%A9%0A%20%20%20%20href%3A%20url)

[Créer une page de définition](https://github.com/annuaire-entreprises-data-gouv-fr/site/new/main/data/definitions?filename=nouvelle-definition.md&value=administrations%3A%20la%20liste%20des%20administrations%20concern%C3%A9es%20%28pour%20connaitre%20la%20liste%20possible%20voir%20la%20liste%20des%20fichiers%20administrations%20dans%20https%3A%2F%2Fgithub.com%2Fetalab%2Fannuaire-entreprises-site%2Ftree%2Fmain%2Fdata%2Fadministration%29%0Atargets%3A%20la%20liste%20des%20cibles%20%C3%A0%20choisir%20parmi%20%3A%20agent%20%7C%20particulier%20%7C%20dirigeant%20%7C%20independant%0Atitle%3A%20titre%0Aseo%3A%20description%20et%20titre%20pour%20le%20SEO%0A%20%20description%3A%0A%20%20title%3A%20si%20pas%20de%20titre%20sp%C3%A9cifi%C3%A9%2C%20le%20titre%20principal%20sera%20utilis%C3%A9%0Abody%3A%20corps%20de%20texte%20%28markdown%29%0Acta%3A%0A%20%20label%3A%20libell%C3%A9%20du%20CTA%0A%20%20to%3A%20url%20%28externe%20%28https%3A%2F%2F%29%20ou%20interne%20en%20commencant%20par%20%2F%29%0Amore%3A%0A%20%20-%20label%3A%20libell%C3%A9%0A%20%20%20%20href%3A%20url)

[Créer une landing page](https://github.com/annuaire-entreprises-data-gouv-fr/site/new/main/data/landing-pages?filename=nouvelle-landing-page.md&value=slug%3A%20ici%20mettre%20le%20nom%20du%20fichier%0Atitle%3A%20titre%20de%20la%20page%0Adescription%3A%20sous-titre%0AfooterLabel%3A%20libell%C3%A9%20dans%20le%20footer%0Apublished%3A%20true%20ou%20false%2C%20si%20a%20false%20la%20page%20n%27est%20pas%20visible%20dans%20le%20footer%0Afilter%3A%20%23%20demander%20de%20l%27aide%20des%20d%C3%A9veloppeurs%0Aseo%3A%0A%20%20title%3A%20titre%20SEO%0A%20%20description%3A%20description%20SEO%0Areassurance%3A%0A%20%20-%20title%3A%20titre%20bloc%201%0A%20%20%20%20body%3A%20corps%20bloc%201%0A%20%20-%20title%3A%20titre%20bloc%202%0A%20%20%20%20body%3A%20body%20block%202%0A%20%20-%20title%3A%20titre%20bloc%203%0A%20%20%20%20body%3A%20body%20block%203%0Adatasources%3A%20la%20liste%20des%20administrations%20concern%C3%A9es%20%28pour%20connaitre%20la%20liste%20possible%20voir%20la%20liste%20des%20fichiers%20administrations%20dans%20https%3A%2F%2Fgithub.com%2Fetalab%2Fannuaire-entreprises-site%2Ftree%2Fmain%2Fdata%2Fadministration%29%0Abody%3A%20le%20corps%20du%20texte%2C%20en%20markdown)

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
