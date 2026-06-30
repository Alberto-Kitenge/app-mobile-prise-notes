# app-mobile-prise-notes

**Organisez vos idées** — application mobile de prise de notes, synchronisée avec Firebase.

Expo 56 · React Native · Firebase Firestore · Zustand

---

## Fonctionnalités

- **Créer, consulter, modifier et supprimer** des notes
- **Catégorisation** (personnel, travail, études, santé, finances, loisirs, autre)
- **Couleurs personnalisables** pour identifier vos notes d'un coup d'œil
- **Modal multi-modes** : création, édition et consultation détaillée
- **Persistance cloud** via Firebase Firestore

---

## Aperçu technique

```
app/index.tsx          → Écran principal (header + liste + modal)
components/            → UI (ListNotes, ModalNotes, ListNotesItem)
stores/notesStore.ts   → État global Zustand
services/notesServices → CRUD Firestore
config/firebaseConfig  → Connexion Firebase
```

Flux de données :

```
Composants UI  →  notesStore (Zustand)  →  notesServices  →  Firestore
```

---

## Prérequis

- [Node.js](https://nodejs.org/) (LTS recommandé)
- Un compte [Firebase](https://console.firebase.google.com/) avec un projet Firestore activé
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (via `npx expo`)

---

## Installation

```bash
npm install
npx expo start
```

Depuis le terminal Expo, ouvrez l'application sur :

- **Android** — émulateur ou appareil physique
- **iOS** — simulateur (macOS) ou appareil physique
- **Web** — navigateur

---

## Configuration Firebase

Créez un fichier `.env` à la racine du projet avec vos clés Firebase (préfixe `EXPO_PUBLIC_` requis par Expo) :

```env
EXPO_PUBLIC_FIREBASE_API_KEY=votre_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=votre_projet.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=votre_projet_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=votre_projet.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=votre_app_id
```

Les valeurs se trouvent dans la console Firebase : **Paramètres du projet → Vos applications → Config SDK**.

Dans Firestore, les notes sont stockées dans la collection `notes`. Adaptez les règles de sécurité selon vos besoins (mode test pour le développement, règles restrictives en production).

> Redémarrez le serveur Expo (`npx expo start`) après toute modification du fichier `.env`.

---

## Structure du projet

```
app-mobile-prise-notes/
├── app/                  # Routes Expo Router
│   ├── _layout.tsx       # Layout racine
│   └── index.tsx         # Écran principal
├── components/           # Composants UI
│   ├── ListNotes.tsx
│   ├── ListNotesItem.tsx
│   └── ModalNotes.tsx
├── config/
│   └── firebaseConfig.ts # Initialisation Firebase
├── constants/
│   └── notesConstants.ts # Catégories et couleurs
├── services/
│   └── notesServices.ts  # Opérations Firestore
├── stores/
│   └── notesStore.ts     # Store Zustand
└── types/
    └── notesTypes.ts     # Types TypeScript
```

---

## Scripts disponibles

| Commande           | Description                    |
| ------------------ | ------------------------------ |
| `npm start`        | Lance le serveur de développement Expo |
| `npm run android`  | Ouvre sur Android              |
| `npm run ios`      | Ouvre sur iOS                  |
| `npm run web`      | Ouvre dans le navigateur       |
| `npm run lint`     | Vérifie le code avec ESLint    |

---

## Licence

Voir le fichier [LICENSE](LICENSE).
