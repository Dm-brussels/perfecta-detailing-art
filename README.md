# Perfecta Detailing Art

Landing page du centre esthétique automobile Perfecta Detailing Art
(PPF, traitement céramique, detailing) — Braine-l'Alleud.

Next.js 16 · React 19 · Tailwind v4 · Resend · Vercel Blob.

## Démarrer

```bash
npm install
npm run dev
```

Copier `.env.example` vers `.env.local` et renseigner les variables utiles.
Sans `BLOB_READ_WRITE_TOKEN`, les leads sont écrits dans `./.data` (ignoré par git).

## Parcours de conversion

Trois chemins, tous instrumentés :

| Chemin | Point d'entrée | Événement |
| --- | --- | --- |
| Devis | CTA bleus, barre sticky, header, menu mobile | `cta_click` → `quote_submit` |
| WhatsApp | Barre sticky, hero, footer, page devis | `whatsapp_open` → `whatsapp_click` |
| Téléphone | Header, hero, section atelier, footer | `phone_click` |

Le formulaire de devis (`/devis`) tient en trois étapes : prestation, projet
(véhicule + délai), coordonnées. Le téléphone y est obligatoire.

Le bouton WhatsApp ouvre un mini-formulaire d'une étape (prestation + délai)
qui génère un message pré-rempli avant d'ouvrir la conversation.

## Tracking

`lib/analytics.ts` envoie chaque événement vers :

1. `window.dataLayer` et `gtag` — exploitables par GTM, GA4 et Google Ads.
   Renseigner `NEXT_PUBLIC_GTM_ID` **ou** `NEXT_PUBLIC_GA_ID` pour charger le tag.
2. `/api/track` — compteur interne persistant lu par le dashboard.

## Espace privé `/leads`

Dashboard des demandes et des interactions. Non indexé (`noindex` + `robots.txt`),
absent de la navigation, protégé par un mot de passe vérifié côté serveur
(`LEADS_PASSWORD`, session en cookie httpOnly signé, limitation des tentatives).

## Stockage

Vercel Blob, un fichier par enregistrement, store **privé** (`perfecta-leads`) :

- `leads/<horodatage>__<id>.txt` — le lead complet, chiffré en AES-256-GCM
  avec une clé dérivée de `LEADS_SECRET`.
- `events/<horodatage>__<type>.txt` — le type et la date tiennent dans le nom
  du fichier : les statistiques se calculent sans télécharger aucun contenu.

> `LEADS_SECRET` ne doit jamais changer : les leads déjà enregistrés
> deviendraient illisibles.

## Note technique — animations

`AnimatePresence` de framer-motion 12.38 ne résout pas ses animations de sortie
dans cette combinaison React 19 / Next 16 : l'élément sortant ne se démonte
jamais et l'élément entrant ne se monte pas. Les composants concernés
(formulaire, onglets services, FAQ, galerie, modale WhatsApp) utilisent donc des
transitions d'entrée seules ou du CSS. Ne pas réintroduire `AnimatePresence`
sans vérifier que la sortie se termine.
